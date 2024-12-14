import { Test, TestingModule } from '@nestjs/testing';
import { TradingService } from './trading.service';
import { CoinbaseService } from '../coinbase/coinbase.service';
import { MarketAnalysisService } from '../market-analysis/market-analysis.service';

describe('TradingService', () => {
  let tradingService: TradingService;

  let coinbaseService: Partial<jest.Mocked<CoinbaseService>>;
  let marketAnalysisService: Partial<jest.Mocked<MarketAnalysisService>>;

  beforeEach(async () => {
    coinbaseService = {};
    marketAnalysisService = {
      analyzeMarket: jest.fn().mockResolvedValue({
        bestShortTermCoins: ['ETH'],
        bestLongTermCoins: ['BTC'],
        priorityCoinsHighlighted: ['BTC'],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradingService,
        { provide: CoinbaseService, useValue: coinbaseService },
        { provide: MarketAnalysisService, useValue: marketAnalysisService },
      ],
    }).compile();

    tradingService = module.get<TradingService>(TradingService);
  });

  it('should be defined', () => {
    expect(tradingService).toBeDefined();
  });
});
