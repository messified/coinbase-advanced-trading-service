import { Test, TestingModule } from '@nestjs/testing';
import { MarketAnalysisService } from './market-analysis.service';
import { CustomConfigService } from '../config/custom-config.service';

describe('MarketAnalysisService', () => {
  let service: MarketAnalysisService;
  let configService: Partial<jest.Mocked<CustomConfigService>>;

  beforeEach(async () => {
    configService = {
      getPriorityCoins: jest.fn(),
    };

    (configService.getPriorityCoins as jest.Mock).mockReturnValue(['BTC', 'ETH', 'SOL']);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketAnalysisService,
        { provide: CustomConfigService, useValue: configService },
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
