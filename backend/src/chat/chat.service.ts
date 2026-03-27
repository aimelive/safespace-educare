import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { StartChatDto } from './dto/start-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly db: DatabaseService) {}

  async startSession(dto: StartChatDto, userId: string) {
    const result = await this.db.query(
      `INSERT INTO chat_sessions (student_id, is_anonymous, status, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [userId, dto.is_anonymous ?? true, 'open'],
    );
    return result.rows[0];
  }

  async sendMessage(dto: SendMessageDto, userId: string) {
    const result = await this.db.query(
      `INSERT INTO chat_messages (chat_id, sender_id, message, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [dto.chat_id, userId, dto.message],
    );
    return result.rows[0];
  }

  /**
   * Returns sessions for the given user.
   * - Students: see only their own sessions.
   * - Counselors / admins: see all sessions (student identity hidden for
   *   anonymous chats so privacy is preserved).
   */
  async getSessions(userId: string, role: string) {
    if (role === 'counselor' || role === 'admin') {
      const result = await this.db.query(
        `SELECT
           cs.id,
           cs.is_anonymous,
           cs.status,
           cs.created_at,
           cs.counselor_id,
           CASE WHEN cs.is_anonymous THEN 'Anonymous Student'
                ELSE u.name
           END AS student_name,
           (SELECT COUNT(*)::int
              FROM chat_messages cm
             WHERE cm.chat_id = cs.id) AS message_count
         FROM chat_sessions cs
         LEFT JOIN users u ON cs.student_id = u.id
         ORDER BY cs.created_at DESC`,
        [],
      );
      return result.rows;
    }

    // Student: own sessions only
    const result = await this.db.query(
      `SELECT * FROM chat_sessions WHERE student_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  async getMessages(chatId: string) {
    const result = await this.db.query(
      'SELECT * FROM chat_messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chatId],
    );
    return result.rows;
  }
}
