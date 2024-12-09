
import { Injectable, Logger } from '@nestjs/common';
import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import { ConfigService } from '../config/config.service';
import { Transfer, Trade } from '../../interfaces/coinbase.interface';

@Injectable()
export class CoinbaseService {
  private readonly logger = new Logger(CoinbaseService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKeyName = process.env.COINBASE_API_KEY_NAME;
    const privateKey = process.env.COINBASE_PRIVATE_KEY;

    if (!apiKeyName || !privateKey) {
      throw new Error('Coinbase API key name or private key missing in .env file');
    }

    Coinbase.configure({ apiKeyName, privateKey });
  }

  async listWallets(): Promise<any[]> {
    try {
      const response = await Wallet.listWallets();
      return response.data.map((wallet: any) => ({
        id: wallet.id,
        name: wallet.name,
        defaultAddress: wallet.defaultAddress,
        networkId: wallet.networkId,
      }));
    } catch (error) {
      this.logger.error('Error listing wallets:', error.message);
      throw error;
    }
  }

  async createTrade(walletId: string, trade: Trade): Promise<any> {
    try {
      const wallet = await Wallet.fetch(walletId);
      let transaction = await wallet.createTrade({
        amount: parseInt(trade.amount), // Fixed amount type issue
        fromAssetId: trade.fromAssetId,
        toAssetId: trade.toAssetId,
      });
      transaction = await transaction.wait();
      this.logger.log(`Trade completed: ${transaction}`);
      return transaction;
    } catch (error) {
      this.logger.error('Error creating trade:', error.message);
      throw error;
    }
  }
}
