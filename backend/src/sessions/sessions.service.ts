import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { BookSessionDto } from "./dto/book-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";

@Injectable()
export class SessionsService {
  constructor(private readonly db: DatabaseService) {}

  async getCounselors() {
    const result = await this.db.query(
      "SELECT id, name, specialization, available_hours FROM users WHERE role = $1",
      ["counselor"],
    );
    return result.rows;
  }

  async bookSession(dto: BookSessionDto, studentId: string) {
    const result = await this.db.query(
      `INSERT INTO sessions
         (student_id, counselor_id, scheduled_date, scheduled_time, topic, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [studentId, dto.counselor_id, dto.date, dto.time, dto.topic, "scheduled"],
    );
    return result.rows[0];
  }

  async getMySessions(studentId: string) {
    const result = await this.db.query(
      `SELECT s.*, u.name AS counselor_name
       FROM sessions s
       JOIN users u ON s.counselor_id = u.id
       WHERE s.student_id = $1
       ORDER BY s.scheduled_date DESC`,
      [studentId],
    );
    return result.rows;
  }

  async getCounselorSessions(counselorId: string) {
    const result = await this.db.query(
      `SELECT s.*, u.name AS student_name, u.email AS student_email
       FROM sessions s
       JOIN users u ON s.student_id = u.id
       WHERE s.counselor_id = $1
       ORDER BY s.scheduled_date DESC`,
      [counselorId],
    );
    return result.rows;
  }

  async updateSession(id: string, dto: UpdateSessionDto) {
    const result = await this.db.query(
      `UPDATE sessions
       SET status = $1, notes = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [dto.status, dto.notes ?? null, id],
    );
    return result.rows[0];
  }
}
