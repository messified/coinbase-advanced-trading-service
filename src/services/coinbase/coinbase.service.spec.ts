import { CoinbaseService } from './coinbase.service';
import { ConfigService } from '../config/config.service';
import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';

jest.mock('@coinbase/coinbase-sdk', () => ({
  Coinbase: {
    configure: jest.fn(),
  },
  Wallet: {
    listWallets: jest.fn().mockResolvedValue({
      data: [
        { id: '1', name: 'BTC', defaultAddress: 'address1', networkId: 'network1' },
        { id: '2', name: 'ETH', defaultAddress: 'address2', networkId: 'network2' },
      ],
    }),
    fetch: jest.fn().mockResolvedValue({
      createTrade: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ id: 'trade1', status: 'completed' }),
      }),
    }),
  },
}));

describe('CoinbaseService', () => {
  let service: CoinbaseService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
    jest.spyOn(configService, 'get').mockImplementation((key) => {
      if (key === 'COINBASE_API_KEY_NAME') return 'mock-api-key-name';
      if (key === 'COINBASE_PRIVATE_KEY') return 'mock-private-key';
      return '';
    });

    service = new CoinbaseService(configService);
  });

  it('should list wallets correctly', async () => {
    const wallets = await service.listWallets();
    expect(wallets).toEqual([
      { id: '1', name: 'BTC', defaultAddress: 'address1', networkId: 'network1' },
      { id: '2', name: 'ETH', defaultAddress: 'address2', networkId: 'network2' },
    ]);
  });

  it('should create a trade successfully', async () => {
    const result = await service.createTrade('1', {
      amount: '0.01',
      fromAssetId: 'btc',
      toAssetId: 'eth',
    });

    expect(result).toEqual({ id: 'trade1', status: 'completed' });
  });
});
