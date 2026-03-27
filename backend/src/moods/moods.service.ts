import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MoodCheckinDto } from './dto/mood-checkin.dto';

export interface MoodRow {
  id: string;
  user_id: string;
  mood: string;
  intensity: number;
  notes: string | null;
  created_at: Date;
}

@Injectable()
export class MoodsService {
  constructor(private readonly db: DatabaseService) {}

  async checkin(dto: MoodCheckinDto, userId: string) {
    const result = await this.db.query<MoodRow>(
      `INSERT INTO mood_checkins (user_id, mood, intensity, notes, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [userId, dto.mood, dto.intensity ?? 5, dto.notes ?? null],
    );
    return result.rows[0];
  }

  async getHistory(userId: string, days: number) {
    const result = await this.db.query<MoodRow>(
      `SELECT * FROM mood_checkins
       WHERE user_id = $1
         AND created_at > NOW() - INTERVAL '1 day' * $2
       ORDER BY created_at DESC`,
      [userId, days],
    );

    const rows = result.rows;
    const streak = this.calculateStreak(rows);
    return { moods: rows, streak };
  }

  /**
   * Counts consecutive days that have at least one check-in,
   * walking backwards from the most recent entry.
   */
  private calculateStreak(rows: MoodRow[]): number {
    if (rows.length === 0) return 0;

    let streak = 0;
    let lastDate: string | null = null;

    for (const row of rows) {
      const checkDate = new Date(row.created_at).toDateString();

      if (lastDate === null || checkDate === lastDate) {
        if (checkDate !== lastDate) streak++;
        lastDate = checkDate;
      } else {
        const diff =
          new Date(lastDate).getTime() - new Date(checkDate).getTime();
        if (diff === 24 * 60 * 60 * 1000) {
          streak++;
          lastDate = checkDate;
        } else {
          break;
        }
      }
    }

    return streak;
  }
}
