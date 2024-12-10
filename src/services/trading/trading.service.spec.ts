import { Test, TestingModule } from '@nestjs/testing';
import { TradingService } from './trading.service';
import { CoinbaseService } from '../coinbase/coinbase.service';
import { CustomConfigService } from '../config/custom-config.service';
import { Logger } from '@nestjs/common';

describe('TradingService', () => {
  let tradingService: TradingService;
  let coinbaseService: Partial<jest.Mocked<CoinbaseService>>;
  let configService: Partial<jest.Mocked<CustomConfigService>>;

  beforeEach(async () => {
    coinbaseService = {
      listWallets: jest.fn(),
      createTrade: jest.fn(),
    };

    configService = {
      getPriorityCoins: jest.fn(),
      // Add other config methods if necessary
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradingService,
        { provide: CoinbaseService, useValue: coinbaseService },
        { provide: CustomConfigService, useValue: configService },
      ],
    }).compile();

    tradingService = module.get<TradingService>(TradingService);
    // Suppress or track logger output in tests
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  describe('analyzeAndTrade', () => {
    it('should warn if no priority coins configured', async () => {
      (configService.getPriorityCoins as jest.Mock).mockReturnValue([]);
      await tradingService.analyzeAndTrade();
      expect(Logger.prototype.warn).toHaveBeenCalledWith('No priority coins configured.');
    });

    it('should warn if no wallets found', async () => {
      (configService.getPriorityCoins as jest.Mock).mockReturnValue(['BTC', 'ETH']);
      (coinbaseService.listWallets as jest.Mock).mockResolvedValue([]);
      
      await tradingService.analyzeAndTrade();
      expect(Logger.prototype.warn).toHaveBeenCalledWith('No wallets found.');
    });

    it('should warn if a wallet for a priority coin is not found', async () => {
      (configService.getPriorityCoins as jest.Mock).mockReturnValue(['BTC', 'ETH']);
      // Only have ETH wallet
      (coinbaseService.listWallets as jest.Mock).mockResolvedValue([
        { id: 'wallet_eth', name: 'ETH' },
      ]);

      await tradingService.analyzeAndTrade();
      expect(Logger.prototype.warn).toHaveBeenCalledWith('Wallet for BTC not found.');
    });

    it('should attempt a trade and log success', async () => {
      (configService.getPriorityCoins as jest.Mock).mockReturnValue(['ETH']);
      (coinbaseService.listWallets as jest.Mock).mockResolvedValue([
        { id: 'wallet_eth', name: 'ETH' },
      ]);
      (coinbaseService.createTrade as jest.Mock).mockResolvedValue({ status: 'success', tradeId: '1234' });

      await tradingService.analyzeAndTrade();

      expect(Logger.prototype.log).toHaveBeenCalledWith('Attempting to trade ETH...');
      expect(Logger.prototype.log).toHaveBeenCalledWith(`Trade successful for ETH: {"status":"success","tradeId":"1234"}`);
    });

    it('should log an error if trade throws', async () => {
      (configService.getPriorityCoins as jest.Mock).mockReturnValue(['ETH']);
      (coinbaseService.listWallets as jest.Mock).mockResolvedValue([
        { id: 'wallet_eth', name: 'ETH' },
      ]);
      (coinbaseService.createTrade as jest.Mock).mockRejectedValue(new Error('Trade failed'));

      await tradingService.analyzeAndTrade();

      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'Error trading ETH: Trade failed',
        expect.any(String)
      );
    });
  });

  describe('analyzeOnly', () => {
    it('should log analyzed coins and return analysis', async () => {
      (configService.getPriorityCoins as jest.Mock).mockReturnValue(['BTC', 'ETH']);
      (coinbaseService.listWallets as jest.Mock).mockResolvedValue([
        { id: 'wallet_btc', name: 'BTC' },
        { id: 'wallet_ada', name: 'ADA' },
      ]);

      const analysis = await tradingService.analyzeOnly();
      expect(Logger.prototype.log).toHaveBeenCalledWith('Analyzing priority coins: BTC, ETH');
      expect(Logger.prototype.log).toHaveBeenCalledWith('Available wallets: [{"id":"wallet_btc","name":"BTC"},{"id":"wallet_ada","name":"ADA"}]');

      // BTC found, ETH not found
      expect(analysis).toEqual([
        { coin: 'BTC', hasWallet: true, walletDetails: { id: 'wallet_btc', name: 'BTC' } },
        { coin: 'ETH', hasWallet: false, walletDetails: null },
      ]);
    });
  });
});
