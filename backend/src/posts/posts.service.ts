import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly db: DatabaseService) {}

  async getAll() {
    const result = await this.db.query(
      `SELECT p.*, u.name AS author_name
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.is_published = true
       ORDER BY p.created_at DESC`,
    );
    return result.rows;
  }

  async create(dto: CreatePostDto, userId: string) {
    const result = await this.db.query(
      `INSERT INTO posts (user_id, title, content, is_anonymous, is_published, created_at)
       VALUES ($1, $2, $3, $4, true, NOW())
       RETURNING *`,
      [userId, dto.title, dto.content, dto.is_anonymous ?? false],
    );
    return result.rows[0];
  }

  async like(postId: string, userId: string) {
    await this.db.query(
      'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [postId, userId],
    );

    const result = await this.db.query<{ likes: string }>(
      'SELECT COUNT(*) AS likes FROM post_likes WHERE post_id = $1',
      [postId],
    );

    return { likes: parseInt(result.rows[0].likes, 10) };
  }
}
