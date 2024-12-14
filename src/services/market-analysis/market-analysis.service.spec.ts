import { Test, TestingModule } from '@nestjs/testing';
import { MarketAnalysisService } from './market-analysis.service';
import { CoinbaseService } from '../coinbase/coinbase.service';

describe('MarketAnalysisService', () => {
  let service: MarketAnalysisService;
  let coinbaseService: Partial<jest.Mocked<CoinbaseService>>;

  beforeEach(async () => {
    coinbaseService = {
      getPriorityCoins: jest.fn(),
    };

    (coinbaseService.getPriorityCoins as jest.Mock).mockReturnValue(['BTC', 'ETH', 'SOL']);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketAnalysisService,
        { provide: CoinbaseService, useValue: coinbaseService },
      ],
    }).compile();

    service = module.get<MarketAnalysisService>(MarketAnalysisService);
  });

  it('should return best short-term, best long-term, and highlighted priority coins', async () => {
    const result = await service.analyzeMarket();
    expect(result.bestShortTermCoins).toEqual(['ETH', 'SOL']);
    expect(result.bestLongTermCoins).toEqual(['BTC', 'ADA', 'DOT']);
    expect(result.priorityCoinsHighlighted).toEqual(['BTC', 'ETH', 'SOL']);
  });
});
