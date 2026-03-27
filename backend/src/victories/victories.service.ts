import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateVictoryDto } from './dto/create-victory.dto';

@Injectable()
export class VictoriesService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateVictoryDto, userId: string) {
    const result = await this.db.query(
      `INSERT INTO victories (user_id, title, description, category, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [userId, dto.title, dto.description ?? null, dto.category ?? 'general'],
    );
    return result.rows[0];
  }

  async getAll(userId: string) {
    const result = await this.db.query(
      'SELECT * FROM victories WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    );
    return result.rows;
  }
}
