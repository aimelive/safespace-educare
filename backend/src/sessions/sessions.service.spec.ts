import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { DatabaseService } from '../database/database.service';

const mockDb = { query: jest.fn() };

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: DatabaseService, useValue: mockDb },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  // ── getCounselors ──────────────────────────────────────────────────────────

  describe('getCounselors', () => {
    it('returns list of counselors', async () => {
      const counselors = [
        { id: 'c1', name: 'Dr. Jane', specialization: 'CBT', available_hours: 'Mon-Fri' },
      ];
      mockDb.query.mockResolvedValueOnce({ rows: counselors });

      const result = await service.getCounselors();
      expect(result).toEqual(counselors);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("role = $1"),
        ['counselor'],
      );
    });
  });

  // ── bookSession ────────────────────────────────────────────────────────────

  describe('bookSession', () => {
    it('happy path: inserts and returns session', async () => {
      const session = {
        id: 's1', student_id: 'u1', counselor_id: 'c1',
        scheduled_date: '2024-05-15', scheduled_time: '14:00',
        topic: 'Anxiety', status: 'scheduled',
      };
      mockDb.query.mockResolvedValueOnce({ rows: [session] });

      const result = await service.bookSession(
        { counselor_id: 'c1', date: '2024-05-15', time: '14:00', topic: 'Anxiety' },
        'u1',
      );

      expect(result).toEqual(session);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sessions'),
        expect.arrayContaining(['u1', 'c1', '2024-05-15', '14:00', 'Anxiety', 'scheduled']),
      );
    });
  });

  // ── getMySessions ──────────────────────────────────────────────────────────

  describe('getMySessions', () => {
    it('returns sessions for a student', async () => {
      const rows = [{ id: 's1', student_id: 'u1', counselor_name: 'Dr. Jane' }];
      mockDb.query.mockResolvedValueOnce({ rows });

      const result = await service.getMySessions('u1');
      expect(result).toEqual(rows);
    });
  });

  // ── updateSession ──────────────────────────────────────────────────────────

  describe('updateSession', () => {
    it('happy path: updates and returns session', async () => {
      const updated = { id: 's1', status: 'completed', notes: 'Done' };
      mockDb.query.mockResolvedValueOnce({ rows: [updated] });

      const result = await service.updateSession('s1', { status: 'completed', notes: 'Done' });
      expect(result).toEqual(updated);
    });
  });
});
