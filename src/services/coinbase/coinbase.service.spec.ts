import { Test, TestingModule } from '@nestjs/testing';
import { CoinbaseService } from './coinbase.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import { Trade } from '../../interfaces/coinbase.interface';

// Mocks
jest.mock('@coinbase/coinbase-sdk', () => ({
  Coinbase: {
    configure: jest.fn(),
  },
  Wallet: {
    listWallets: jest.fn(),
    fetch: jest.fn(),
    create: jest.fn(),
  },
}));

describe('CoinbaseService', () => {
  let coinbaseService: CoinbaseService;
  let configService: Partial<jest.Mocked<ConfigService>>;

  beforeEach(async () => {
    configService = {
      get: jest.fn(),
    };

    (configService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'COINBASE_API_KEY_NAME') return 'test_api_key_name';
      if (key === 'COINBASE_PRIVATE_KEY') return 'test_private_key';
      return null;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoinbaseService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    coinbaseService = module.get<CoinbaseService>(CoinbaseService);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  describe('constructor', () => {
    it('should configure Coinbase with provided creds', () => {
      expect(Coinbase.configure).toHaveBeenCalledWith({
        apiKeyName: 'test_api_key_name',
        privateKey: 'test_private_key',
      });
    });

    it('should throw if credentials are missing', async () => {
      (configService.get as jest.Mock).mockReturnValueOnce(null); // missing COINBASE_API_KEY_NAME
      expect(() => new CoinbaseService(configService as any)).toThrow(
        'Coinbase API key name or private key missing',
      );
    });
  });

  describe('listWallets', () => {
    it('should return mapped wallets', async () => {
      const mockWalletResponse = {
        data: [
          {
            id: 'w1',
            name: 'BTC Wallet',
            defaultAddress: 'btc-address',
            networkId: 'bitcoin',
          },
          {
            id: 'w2',
            name: 'ETH Wallet',
            defaultAddress: 'eth-address',
            networkId: 'ethereum',
          },
        ],
      };
      (Wallet.listWallets as jest.Mock).mockResolvedValue(mockWalletResponse);

      const wallets = await coinbaseService.listWallets();
      expect(wallets).toEqual([
        { id: 'w1', name: 'BTC Wallet', defaultAddress: 'btc-address', networkId: 'bitcoin' },
        { id: 'w2', name: 'ETH Wallet', defaultAddress: 'eth-address', networkId: 'ethereum' },
      ]);
    });

    it('should log error and rethrow if listing fails', async () => {
      (Wallet.listWallets as jest.Mock).mockRejectedValue(new Error('List failed'));
      await expect(coinbaseService.listWallets()).rejects.toThrow('List failed');
      expect(Logger.prototype.error).toHaveBeenCalledWith('Error listing wallets:', 'List failed');
    });
  });

  describe('createTrade', () => {
    it('should create and return a mapped trade', async () => {
      const mockWallet = {
        id: 'wallet_id',
        createTrade: jest.fn(),
      };
      const mockTrade = {
        amount: 0.01,
        fromAssetId: 'eth',
        toAssetId: 'usdc',
        id: 'trade_id',
        status: 'completed',
        wait: jest.fn().mockResolvedValue({
          id: 'trade_id',
          status: 'completed',
          amount: 0.01,
          fromAssetId: 'eth',
          toAssetId: 'usdc',
        }),
      };

      (Wallet.fetch as jest.Mock).mockResolvedValue(mockWallet);
      mockWallet.createTrade.mockResolvedValue(mockTrade);

      const trade: Trade = {
        amount: '0.01',
        fromAssetId: 'eth',
        toAssetId: 'usdc',
      };

      const result = await coinbaseService.createTrade('wallet_id', trade);
      expect(Wallet.fetch).toHaveBeenCalledWith('wallet_id');
      expect(mockWallet.createTrade).toHaveBeenCalledWith({
        amount: parseFloat(trade.amount),
        fromAssetId: 'eth',
        toAssetId: 'usdc',
      });
      expect(result).toEqual({
        id: 'trade_id',
        status: 'completed',
        amount: 0.01,
        fromAssetId: 'eth',
        toAssetId: 'usdc',
      });
    });

    it('should log error and rethrow if trade creation fails', async () => {
      (Wallet.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      const trade: Trade = {
        amount: '0.01',
        fromAssetId: 'eth',
        toAssetId: 'usdc',
      };
      await expect(coinbaseService.createTrade('wallet_id', trade)).rejects.toThrow('Fetch failed');
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'Error creating trade for wallet ID: wallet_id',
        'Fetch failed',
      );
    });
  });

  describe('createWallet', () => {
    it('should create and return a mapped wallet', async () => {
      const mockWallet = {
        id: 'new_wallet_id',
        networkId: 'ethereum',
        name: 'My New Wallet',
        defaultAddress: '0x123',
      };
      (Wallet.create as jest.Mock).mockResolvedValue(mockWallet);

      const result = await coinbaseService.createWallet();
      expect(Wallet.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'new_wallet_id',
        name: 'My New Wallet',
        defaultAddress: '0x123',
        networkId: 'ethereum',
      });
    });

    it('should log error and rethrow if wallet creation fails', async () => {
      (Wallet.create as jest.Mock).mockRejectedValue(new Error('Create failed'));
      await expect(coinbaseService.createWallet()).rejects.toThrow('Create failed');
      expect(Logger.prototype.error).toHaveBeenCalledWith('Error creating wallet:', 'Create failed');
    });
  });

  describe('mapWalletResponse', () => {
    it('should throw if response is invalid', () => {
      const invalidWallet = { name: 'No ID or networkId' };
      expect(() => (coinbaseService as any).mapWalletResponse(invalidWallet)).toThrow(
        'Invalid wallet response from SDK',
      );
    });
  });

  describe('mapTradeResponse', () => {
    it('should throw if trade response is invalid', () => {
      const invalidTrade = { status: 'completed' }; // no id
      expect(() => (coinbaseService as any).mapTradeResponse(invalidTrade)).toThrow(
        'Invalid trade response from SDK',
      );
    });
  });
});
