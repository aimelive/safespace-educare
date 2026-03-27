import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DatabaseService } from '../database/database.service';

export interface CountRow {
  total: string;
}

export interface TopicRow {
  topic: string;
  count: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getDashboard(userId: string) {
    const cacheKey = `analytics:dashboard:${userId}`;
    const cached = await this.cacheManager.get<{
      totalSessions: number;
      completedSessions: number;
      commonIssues: TopicRow[];
    }>(cacheKey);
    if (cached) return cached;

    const [totalRes, completedRes, topicsRes] = await Promise.all([
      this.db.query<CountRow>(
        'SELECT COUNT(*) AS total FROM sessions WHERE counselor_id = $1',
        [userId],
      ),
      this.db.query<CountRow>(
        "SELECT COUNT(*) AS total FROM sessions WHERE counselor_id = $1 AND status = 'completed'",
        [userId],
      ),
      this.db.query<TopicRow>(
        `SELECT topic, COUNT(*) AS count
         FROM sessions
         WHERE counselor_id = $1
         GROUP BY topic
         ORDER BY count DESC
         LIMIT 5`,
        [userId],
      ),
    ]);

    const result = {
      totalSessions: parseInt(totalRes.rows[0].total, 10),
      completedSessions: parseInt(completedRes.rows[0].total, 10),
      commonIssues: topicsRes.rows,
    };
    await this.cacheManager.set(cacheKey, result, 45);
    return result;
  }

  async getAdminStats() {
    const cacheKey = 'analytics:admin';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const [
      studentsRes,
      counselorsRes,
      sessionsRes,
      sessionsByStatusRes,
      openChatsRes,
      resourcesRes,
      topicsRes,
      counselorActivityRes,
    ] = await Promise.all([
      this.db.query<CountRow>(
        "SELECT COUNT(*) AS total FROM users WHERE role = 'student'",
      ),
      this.db.query<CountRow>(
        "SELECT COUNT(*) AS total FROM users WHERE role = 'counselor'",
      ),
      this.db.query<CountRow>('SELECT COUNT(*) AS total FROM sessions'),
      this.db.query<{ status: string; count: string }>(
        'SELECT status, COUNT(*) AS count FROM sessions GROUP BY status',
      ),
      this.db.query<CountRow>(
        "SELECT COUNT(*) AS total FROM chat_sessions WHERE status = 'open'",
      ),
      this.db.query<CountRow>(
        'SELECT COUNT(*) AS total FROM resources',
      ),
      this.db.query<TopicRow>(
        `SELECT topic, COUNT(*) AS count
         FROM sessions
         WHERE topic IS NOT NULL AND topic <> ''
         GROUP BY topic
         ORDER BY count DESC
         LIMIT 8`,
      ),
      this.db.query<{ name: string; total: string; completed: string }>(
        `SELECT u.name,
                COUNT(s.id)::int                                              AS total,
                COUNT(s.id) FILTER (WHERE s.status = 'completed')::int       AS completed
         FROM users u
         LEFT JOIN sessions s ON s.counselor_id = u.id
         WHERE u.role = 'counselor'
         GROUP BY u.id, u.name
         ORDER BY total DESC`,
      ),
    ]);

    const statusMap: Record<string, number> = {};
    for (const row of sessionsByStatusRes.rows) {
      statusMap[row.status] = parseInt(row.count, 10);
    }

    const result = {
      totalStudents: parseInt(studentsRes.rows[0].total, 10),
      totalCounselors: parseInt(counselorsRes.rows[0].total, 10),
      totalSessions: parseInt(sessionsRes.rows[0].total, 10),
      scheduledSessions: statusMap['scheduled'] ?? 0,
      completedSessions: statusMap['completed'] ?? 0,
      cancelledSessions: statusMap['cancelled'] ?? 0,
      openChatSessions: parseInt(openChatsRes.rows[0].total, 10),
      totalResources: parseInt(resourcesRes.rows[0].total, 10),
      commonTopics: topicsRes.rows.map((r) => ({
        topic: r.topic,
        count: parseInt(r.count, 10),
      })),
      counselorActivity: counselorActivityRes.rows,
    };

    await this.cacheManager.set(cacheKey, result, 60);
    return result;
  }
}
