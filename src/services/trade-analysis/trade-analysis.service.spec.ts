import { Test, TestingModule } from '@nestjs/testing';
import { CustomConfigService } from '../config/custom-config.service';
import { CoinbaseService } from '../coinbase/coinbase.service';
import { TradingService } from '../trading/trading.service';

describe('TradingService', () => {
  let service: TradingService;
  let mockConfigService: Partial<CustomConfigService>;
  let mockCoinbaseService: Partial<CoinbaseService>;

  beforeEach(async () => {
    mockConfigService = {
      getPriorityCoins: jest.fn().mockReturnValue(['BTC', 'ETH']),
    };

    mockCoinbaseService = {
      listWallets: jest.fn().mockResolvedValue([
        { id: '1', name: 'BTC', defaultAddress: 'address1', networkId: 'network1' },
        { id: '2', name: 'ETH', defaultAddress: 'address2', networkId: 'network2' },
      ]),
      createTrade: jest.fn().mockResolvedValue({ id: 'trade1', status: 'completed' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradingService,
        { provide: CustomConfigService, useValue: mockConfigService },
        { provide: CoinbaseService, useValue: mockCoinbaseService },
      ],
    }).compile();

    service = module.get<TradingService>(TradingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should analyze and trade priority coins', async () => {
    await service.analyzeAndTrade();

    expect(mockCoinbaseService.listWallets).toHaveBeenCalled();
    expect(mockCoinbaseService.createTrade).toHaveBeenCalledWith('1', expect.any(Object));
    expect(mockCoinbaseService.createTrade).toHaveBeenCalledWith('2', expect.any(Object));
  });
});
