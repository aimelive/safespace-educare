import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AnalyticsService } from './analytics.service';
import { DatabaseService } from '../database/database.service';

const mockDb = { query: jest.fn() };
const mockCache = { get: jest.fn(), set: jest.fn() };

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: DatabaseService, useValue: mockDb },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('getDashboard', () => {
    it('happy path: returns aggregated stats', async () => {
      // Promise.all fires 3 queries simultaneously
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ total: '42' }] })     // totalSessions
        .mockResolvedValueOnce({ rows: [{ total: '30' }] })     // completedSessions
        .mockResolvedValueOnce({                                 // commonIssues
          rows: [{ topic: 'Anxiety', count: '12' }],
        });
      mockCache.get.mockResolvedValueOnce(undefined);
      mockCache.set.mockResolvedValueOnce(undefined);

      const result = await service.getDashboard('counselor-uuid');

      expect(result.totalSessions).toBe(42);
      expect(result.completedSessions).toBe(30);
      expect(result.commonIssues).toHaveLength(1);
      expect(result.commonIssues[0].topic).toBe('Anxiety');
    });
  });
});
