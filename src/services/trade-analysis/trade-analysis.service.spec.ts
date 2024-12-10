import { Test, TestingModule } from '@nestjs/testing';
import { TradeAnalysisService } from './trade-analysis.service';

interface Pair {
  base_currency: string;
  status: string;
  volume_24h: number;
}

describe('TradeAnalysisService', () => {
  let service: TradeAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeAnalysisService],
    }).compile();

    service = module.get<TradeAnalysisService>(TradeAnalysisService);
  });

  describe('analyzePairs', () => {
    it('should filter out pairs not online', () => {
      const pairs: Pair[] = [
        { base_currency: 'BTC', status: 'online', volume_24h: 150000 },
        { base_currency: 'ETH', status: 'offline', volume_24h: 200000 },
      ];

      const result = service.analyzePairs(pairs);
      expect(result).toEqual([
        { base_currency: 'BTC', status: 'online', volume_24h: 150000 },
      ]);
    });

    it('should filter out pairs with volume less than the threshold', () => {
      const pairs: Pair[] = [
        { base_currency: 'BTC', status: 'online', volume_24h: 50000 },
        { base_currency: 'ETH', status: 'online', volume_24h: 150000 },
      ];

      const result = service.analyzePairs(pairs);
      expect(result).toEqual([
        { base_currency: 'ETH', status: 'online', volume_24h: 150000 },
      ]);
    });

    it('should allow a custom volume threshold', () => {
      const pairs: Pair[] = [
        { base_currency: 'BTC', status: 'online', volume_24h: 80000 },
        { base_currency: 'ETH', status: 'online', volume_24h: 120000 },
      ];

      const result = service.analyzePairs(pairs, 100000);
      expect(result).toEqual([
        { base_currency: 'ETH', status: 'online', volume_24h: 120000 },
      ]);
    });

    it('should return an empty array if no pairs match criteria', () => {
      const pairs: Pair[] = [
        { base_currency: 'BTC', status: 'offline', volume_24h: 200000 },
        { base_currency: 'ETH', status: 'online', volume_24h: 50000 },
      ];

      const result = service.analyzePairs(pairs);
      expect(result).toEqual([]);
    });

    it('should throw an error if pairs is not an array', () => {
      expect(() => service.analyzePairs(null as any)).toThrow(
        'Invalid input: pairs must be an array.',
      );
    });
  });

  describe('prioritizePairs', () => {
    it('should return pairs filtered by priority coins', () => {
      const pairs: Pair[] = [
        { base_currency: 'BTC', status: 'online', volume_24h: 200000 },
        { base_currency: 'ETH', status: 'online', volume_24h: 100000 },
        { base_currency: 'ADA', status: 'online', volume_24h: 300000 },
      ];
      const priorityCoins = ['BTC', 'ADA'];

      const result = service.prioritizePairs(pairs, priorityCoins);
      expect(result).toEqual([
        { base_currency: 'ADA', status: 'online', volume_24h: 300000 },
        { base_currency: 'BTC', status: 'online', volume_24h: 200000 },
      ]);
    });

    it('should return an empty array if no pairs match the priority coins', () => {
      const pairs: Pair[] = [
        { base_currency: 'ETH', status: 'online', volume_24h: 200000 },
        { base_currency: 'SOL', status: 'online', volume_24h: 150000 },
      ];
      const priorityCoins = ['BTC', 'ADA'];

      const result = service.prioritizePairs(pairs, priorityCoins);
      expect(result).toEqual([]);
    });

    it('should sort the filtered pairs by volume_24h in descending order', () => {
      const pairs: Pair[] = [
        { base_currency: 'BTC', status: 'online', volume_24h: 200000 },
        { base_currency: 'ADA', status: 'online', volume_24h: 300000 },
        { base_currency: 'ETH', status: 'online', volume_24h: 500000 },
      ];
      const priorityCoins = ['ADA', 'ETH', 'BTC'];

      const result = service.prioritizePairs(pairs, priorityCoins);
      expect(result).toEqual([
        { base_currency: 'ETH', status: 'online', volume_24h: 500000 },
        { base_currency: 'ADA', status: 'online', volume_24h: 300000 },
        { base_currency: 'BTC', status: 'online', volume_24h: 200000 },
      ]);
    });

    it('should throw an error if pairs is not an array', () => {
      expect(() => service.prioritizePairs(null as any, ['BTC'])).toThrow(
        'Invalid input: pairs and priorityCoins must be arrays.',
      );
    });

    it('should throw an error if priorityCoins is not an array', () => {
      const pairs: Pair[] = [
        { base_currency: 'BTC', status: 'online', volume_24h: 200000 },
      ];
      expect(() => service.prioritizePairs(pairs, null as any)).toThrow(
        'Invalid input: pairs and priorityCoins must be arrays.',
      );
    });
  });
});
