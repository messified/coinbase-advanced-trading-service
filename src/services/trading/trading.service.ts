
import { Injectable, Logger } from '@nestjs/common';
import { CoinbaseService } from '../coinbase/coinbase.service';
import { ConfigService } from '../config/config.service';
import { Trade } from '../../interfaces/coinbase.interface';

@Injectable()
export class TradingService {
  private readonly logger = new Logger(TradingService.name);

  constructor(
    private readonly coinbaseService: CoinbaseService,
    private readonly configService: ConfigService,
  ) {}

  async analyzeAndTrade() {
    const priorityCoins = this.configService.getPriorityCoins();
    const wallets = await this.coinbaseService.listWallets();

    for (const coin of priorityCoins) {
      const wallet = wallets.find(w => w.name === coin);
      if (!wallet) {
        this.logger.warn(`Wallet for ${coin} not found.`);
        continue;
      }

      try {
        this.logger.log(`Trading ${coin}...`);
        await this.coinbaseService.createTrade(wallet.id, {
          amount: '0.01',
          fromAssetId: 'eth', // Fixed undefined `Coinbase.assets`
          toAssetId: 'usdc', // Fixed undefined `Coinbase.assets`
        } as Trade);
      } catch (error) {
        this.logger.error(`Error trading ${coin}:`, error.message);
      }
    }
  }
}
