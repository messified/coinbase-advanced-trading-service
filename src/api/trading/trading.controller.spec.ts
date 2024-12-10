import { Test, TestingModule } from '@nestjs/testing';
import { TradingController } from './trading.controller';
import { TradingService } from 'src/services/trading/trading.service';

describe('TradingController', () => {
  let controller: TradingController;
  let tradingService: TradingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradingController],
      providers: [
        {
          provide: TradingService,
          useValue: {
            analyzeAndTrade: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<TradingController>(TradingController);
    tradingService = module.get<TradingService>(TradingService);
  });

  it('should execute analyze-and-trade and return success response', async () => {
    const result = await controller.analyzeAndTrade();
    expect(result).toEqual({ success: true, message: 'Trading process executed successfully.' });
    expect(tradingService.analyzeAndTrade).toHaveBeenCalled();
  });
});
