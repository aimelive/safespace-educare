import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool, QueryResult, QueryResultRow } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { DatabaseSchema } from "./db.types";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool!: Pool;
  private db!: Kysely<DatabaseSchema>;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const connectionString = this.configService.get<string>("DATABASE_URL");
    const max = this.configService.get<number>("database.poolMax") ?? 20;
    const idleTimeoutMillis =
      this.configService.get<number>("database.poolIdleTimeoutMs") ?? 30000;
    const connectionTimeoutMillis =
      this.configService.get<number>("database.poolConnectionTimeoutMs") ??
      5000;

    this.pool = new Pool({
      connectionString,
      max,
      idleTimeoutMillis,
      connectionTimeoutMillis,
    });
    this.db = new Kysely<DatabaseSchema>({
      dialect: new PostgresDialect({ pool: this.pool }),
    });

    try {
      const client = await this.pool.connect();
      client.release();
      this.logger.log("PostgreSQL connection pool established");
    } catch (error) {
      this.logger.error("Failed to connect to PostgreSQL", error);
      throw new InternalServerErrorException("Database connection failed");
    }

    await this.runMigrations();
  }

  private async runMigrations(): Promise<void> {
    try {
      await this.pool.query(`
        ALTER TABLE users
          ADD COLUMN IF NOT EXISTS specialization TEXT,
          ADD COLUMN IF NOT EXISTS available_hours TEXT
      `);

      // Create chat tables if they don't exist
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID NOT NULL REFERENCES users(id),
          counselor_id UUID REFERENCES users(id),
          is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
          status VARCHAR(20) NOT NULL DEFAULT 'open',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          chat_id UUID NOT NULL REFERENCES chat_sessions(id),
          sender_id UUID NOT NULL REFERENCES users(id),
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      // Add counselor_id column to existing chat_sessions if missing (idempotent)
      await this.pool.query(`
        ALTER TABLE chat_sessions
          ADD COLUMN IF NOT EXISTS counselor_id UUID REFERENCES users(id)
      `);

      // Ensure resources table has all required columns
      await this.pool.query(`
        ALTER TABLE resources
          ADD COLUMN IF NOT EXISTS title       TEXT NOT NULL DEFAULT '',
          ADD COLUMN IF NOT EXISTS description TEXT,
          ADD COLUMN IF NOT EXISTS url         TEXT,
          ADD COLUMN IF NOT EXISTS type        TEXT
      `);

      const indexes = [
        "CREATE INDEX IF NOT EXISTS idx_users_role ON users (role)",
        "CREATE INDEX IF NOT EXISTS idx_sessions_student_scheduled ON sessions (student_id, scheduled_date DESC)",
        "CREATE INDEX IF NOT EXISTS idx_sessions_counselor_scheduled ON sessions (counselor_id, scheduled_date DESC)",
        "CREATE INDEX IF NOT EXISTS idx_chat_sessions_student ON chat_sessions (student_id)",
        "CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions (status)",
        "CREATE INDEX IF NOT EXISTS idx_chat_messages_chat ON chat_messages (chat_id, created_at ASC)",
      ];
      for (const sql of indexes) {
        await this.pool.query(sql);
      }
      this.logger.log("Database migrations applied");
    } catch (error) {
      this.logger.error("Failed to apply migrations", error);
      throw new InternalServerErrorException("Database migration failed");
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.db.destroy();
    await this.pool.end();
    this.logger.log("PostgreSQL pool closed");
  }

  get kysely(): Kysely<DatabaseSchema> {
    return this.db;
  }

  /**
   * Execute a parameterised SQL query.
   * All feature services should use this instead of creating their own pools.
   */
  async query<T extends QueryResultRow = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    const queryTimeoutMs =
      this.configService.get<number>("database.queryTimeoutMs") ?? 10000;
    const slowQueryMs =
      this.configService.get<number>("database.slowQueryMs") ?? 200;

    try {
      const queryPromise = this.pool.query<T>(
        text,
        params as unknown[] | undefined,
      );
      let timeoutRef: NodeJS.Timeout | undefined;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutRef = setTimeout(() => {
          reject(new Error(`Database query timeout after ${queryTimeoutMs}ms`));
        }, queryTimeoutMs);
      });
      const result = (await Promise.race([
        queryPromise,
        timeoutPromise,
      ])) as QueryResult<T>;
      if (timeoutRef) clearTimeout(timeoutRef);
      const elapsed = Date.now() - start;
      if (elapsed > slowQueryMs) {
        this.logger.warn(
          `Slow query (${elapsed}ms): ${text.replace(/\s+/g, " ").trim()}`,
        );
      }
      return result;
    } catch (error) {
      this.logger.error(`Query failed: ${text}`, error);
      throw error;
    }
  }
}
