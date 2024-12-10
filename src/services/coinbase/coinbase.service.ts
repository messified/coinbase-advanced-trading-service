import { Injectable, Logger } from '@nestjs/common';
import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import { Trade, TradeResponse, WalletResponse } from '../../interfaces/coinbase.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoinbaseService {
  private readonly logger = new Logger(CoinbaseService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKeyName = this.configService.get('COINBASE_API_KEY_NAME');
    const privateKey = this.configService.get('COINBASE_PRIVATE_KEY');

    if (!apiKeyName || !privateKey) {
      throw new Error('Coinbase API key name or private key missing');
    }

    Coinbase.configure({ apiKeyName, privateKey });
  }

  async listWallets(): Promise<WalletResponse[]> {
    try {
      const response = await Wallet.listWallets();
      return response.data.map((wallet: any): WalletResponse => ({
        id: wallet.id,
        name: wallet.name || '',
        defaultAddress: wallet.defaultAddress || '',
        networkId: wallet.networkId,
      }));
    } catch (error) {
      this.logger.error('Error listing wallets:', error.message);
      throw error;
    }
  }

  async createTrade(walletId: string, trade: Trade): Promise<TradeResponse> {
    try {
      const wallet = await Wallet.fetch(walletId);
      let transaction = await wallet.createTrade({
        amount: parseFloat(trade.amount),
        fromAssetId: trade.fromAssetId,
        toAssetId: trade.toAssetId,
      });
      transaction = await transaction.wait();
      return this.mapTradeResponse(transaction);
    } catch (error) {
      this.logger.error(`Error creating trade for wallet ID: ${walletId}`, error.message);
      throw error;
    }
  }

  async createWallet(): Promise<WalletResponse> {
    try {
      const wallet = await Wallet.create();
      return this.mapWalletResponse(wallet);
    } catch (error) {
      this.logger.error('Error creating wallet:', error.message);
      throw error;
    }
  }

  private mapWalletResponse(wallet: any): WalletResponse {
    if (!wallet.id || !wallet.networkId) {
      throw new Error('Invalid wallet response from SDK');
    }
    return {
      id: wallet.id,
      name: wallet.name || '',
      defaultAddress: wallet.defaultAddress || '',
      networkId: wallet.networkId,
    };
  }

  private mapTradeResponse(trade: any): TradeResponse {
    if (!trade.id || !trade.status) {
      throw new Error('Invalid trade response from SDK');
    }
    return {
      id: trade.id,
      status: trade.status,
      amount: trade.amount,
      fromAssetId: trade.fromAssetId,
      toAssetId: trade.toAssetId,
    };
  }
}
