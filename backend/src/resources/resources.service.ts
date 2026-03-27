import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Cache } from "cache-manager";
import { DatabaseService } from "../database/database.service";
import { SaveResourceDto } from "./dto/save-resource.dto";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

@Injectable()
export class ResourcesService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // ── Public / student ────────────────────────────────────────────────────────

  async getAll(category?: string, pagination?: PaginationQueryDto) {
    const page = pagination?.page;
    const limit = pagination?.limit;
    const cacheKey = `resources:list:${category ?? "all"}:${page ?? "none"}:${limit ?? "none"}`;
    const cached = await this.cacheManager.get<unknown[]>(cacheKey);
    if (cached) return cached;

    let query = this.db.kysely
      .selectFrom("resources")
      .selectAll()
      .where("is_active", "=", true);

    if (category) {
      query = query.where("category", "=", category);
    }

    query = query.orderBy("created_at", "desc");

    if (page && limit) {
      query = query.limit(limit).offset((page - 1) * limit);
    }

    const rows = await query.execute();
    await this.cacheManager.set(cacheKey, rows, 60);
    return rows;
  }

  async save(dto: SaveResourceDto, userId: string) {
    const result = await this.db.query(
      `INSERT INTO saved_resources (user_id, resource_id, saved_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT DO NOTHING
       RETURNING *`,
      [userId, dto.resource_id],
    );
    await this.cacheManager.clear();
    return result.rows[0];
  }

  async getSaved(userId: string) {
    const result = await this.db.query(
      `SELECT r.*
       FROM resources r
       JOIN saved_resources sr ON r.id = sr.resource_id
       WHERE sr.user_id = $1
       ORDER BY sr.saved_at DESC`,
      [userId],
    );
    return result.rows;
  }

  // ── Admin CRUD ──────────────────────────────────────────────────────────────

  async getAllAdmin() {
    const result = await this.db.query(
      `SELECT * FROM resources ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  async create(dto: CreateResourceDto) {
    const result = await this.db.query(
      `INSERT INTO resources (title, description, url, category, type, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        dto.title,
        dto.description,
        dto.url,
        dto.category,
        dto.type ?? null,
        dto.is_active ?? true,
      ],
    );
    await this.cacheManager.clear();
    return result.rows[0];
  }

  async update(id: string, dto: UpdateResourceDto) {
    // Build SET clause dynamically from only the fields provided
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.title !== undefined)       { fields.push(`title = $${idx++}`);       values.push(dto.title); }
    if (dto.description !== undefined) { fields.push(`description = $${idx++}`); values.push(dto.description); }
    if (dto.url !== undefined)         { fields.push(`url = $${idx++}`);         values.push(dto.url); }
    if (dto.category !== undefined)    { fields.push(`category = $${idx++}`);    values.push(dto.category); }
    if (dto.type !== undefined)        { fields.push(`type = $${idx++}`);        values.push(dto.type); }
    if (dto.is_active !== undefined)   { fields.push(`is_active = $${idx++}`);   values.push(dto.is_active); }

    if (fields.length === 0) {
      // Nothing to update — return existing row
      const existing = await this.db.query(
        `SELECT * FROM resources WHERE id = $1`,
        [id],
      );
      if (!existing.rows[0]) throw new NotFoundException('Resource not found');
      return existing.rows[0];
    }

    values.push(id);
    const result = await this.db.query(
      `UPDATE resources SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    if (!result.rows[0]) throw new NotFoundException('Resource not found');
    await this.cacheManager.clear();
    return result.rows[0];
  }

  async remove(id: string) {
    const result = await this.db.query(
      `DELETE FROM resources WHERE id = $1 RETURNING id`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundException('Resource not found');
    await this.cacheManager.clear();
    return { deleted: true };
  }
}
