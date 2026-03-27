import { Test, TestingModule } from '@nestjs/testing';
import { MoodsService } from './moods.service';
import { DatabaseService } from '../database/database.service';

const mockDb = { query: jest.fn() };

describe('MoodsService', () => {
  let service: MoodsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoodsService,
        { provide: DatabaseService, useValue: mockDb },
      ],
    }).compile();
    service = module.get<MoodsService>(MoodsService);
  });

  describe('checkin', () => {
    it('inserts mood and returns row', async () => {
      const row = { id: 'm1', user_id: 'u1', mood: 'calm', intensity: 7, created_at: new Date() };
      mockDb.query.mockResolvedValueOnce({ rows: [row] });

      const result = await service.checkin({ mood: 'calm', intensity: 7 }, 'u1');
      expect(result).toEqual(row);
    });
  });

  describe('getHistory', () => {
    it('returns moods and streak=1 for single entry', async () => {
      const rows = [{ id: 'm1', user_id: 'u1', mood: 'happy', intensity: 8, created_at: new Date() }];
      mockDb.query.mockResolvedValueOnce({ rows });

      const result = await service.getHistory('u1', 30);
      expect(result.moods).toEqual(rows);
      expect(result.streak).toBeGreaterThanOrEqual(1);
    });

    it('returns streak=0 for empty history', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });
      const result = await service.getHistory('u1', 30);
      expect(result.streak).toBe(0);
    });
  });
});
