import { Test, TestingModule } from '@nestjs/testing';
import { CoinbaseService } from 'src/services/coinbase/coinbase.service';
import { CustomConfigService } from 'src/services/config/custom-config.service';
import { MarketAnalysisService } from 'src/services/market-analysis/market-analysis.service';
import { TradingService } from 'src/services/trading/trading.service';


describe('TradingService - Market Analysis', () => {
  let tradingService: TradingService;
  let coinbaseService: Partial<jest.Mocked<CoinbaseService>>;
  let configService: Partial<jest.Mocked<CustomConfigService>>;
  let marketAnalysisService: Partial<jest.Mocked<MarketAnalysisService>>;

  beforeEach(async () => {
    coinbaseService = {};
    configService = {};
    marketAnalysisService = {
      analyzeMarket: jest.fn(),
    };

    (marketAnalysisService.analyzeMarket as jest.Mock).mockResolvedValue({
      bestShortTermCoins: ['ETH'],
      bestLongTermCoins: ['BTC'],
      priorityCoinsHighlighted: ['BTC'],
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradingService,
        { provide: CoinbaseService, useValue: coinbaseService },
        { provide: CustomConfigService, useValue: configService },
        { provide: MarketAnalysisService, useValue: marketAnalysisService },
      ],
    }).compile();

    tradingService = module.get<TradingService>(TradingService);
  });

  it('getMarketAnalysis should return market analysis results', async () => {
    const result = await tradingService.getMarketAnalysis();
    expect(marketAnalysisService.analyzeMarket).toHaveBeenCalled();
    expect(result).toEqual({
      bestShortTermCoins: ['ETH'],
      bestLongTermCoins: ['BTC'],
      priorityCoinsHighlighted: ['BTC'],
    });
  });
});
