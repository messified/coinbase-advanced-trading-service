import { Test, TestingModule } from '@nestjs/testing';
import { TradingService } from './trading.service';
import { ConfigService } from '../config/config.service';
import { CoinbaseService } from '../coinbase/coinbase.service';

describe('TradingService', () => {
  let service: TradingService;
  let mockConfigService: Partial<ConfigService>;
  let mockCoinbaseService: Partial<CoinbaseService>;

  beforeEach(async () => {
    // Mock ConfigService
    mockConfigService = {
      getPriorityCoins: jest.fn().mockReturnValue(['BTC', 'ETH']),
    };

    // Mock CoinbaseService
    mockCoinbaseService = {
      listWallets: jest.fn().mockResolvedValue([
        { id: '1', name: 'BTC', defaultAddress: 'address1', networkId: 'network1' },
        { id: '2', name: 'ETH', defaultAddress: 'address2', networkId: 'network2' },
      ]),
      createTrade: jest.fn().mockResolvedValue({ id: 'trade1', status: 'completed' }),
    };

    // Test module setup
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradingService,
        { provide: ConfigService, useValue: mockConfigService },
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
