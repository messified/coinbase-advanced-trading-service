import { Injectable, Logger } from '@nestjs/common';
import { CoinbaseService } from '../coinbase/coinbase.service';
import { Trade } from '../../interfaces/coinbase.interface';
import { MarketAnalysisService } from '../market-analysis/market-analysis.service';

@Injectable()
export class TradingService {
  private readonly logger = new Logger(TradingService.name);

  constructor(
    private readonly coinbaseService: CoinbaseService,
    private readonly marketAnalysisService: MarketAnalysisService, // Injected here
  ) {}

  /**
   * Analyzes priority coins and attempts trades for available wallets.
   */
  async analyzeAndTrade(): Promise<void> {
    const priorityCoins = this.coinbaseService.getPriorityCoins();
    if (!priorityCoins.length) {
      this.logger.warn('No priority coins configured.');
      return;
    }

    const wallets = await this.coinbaseService.listWallets();
    if (!wallets.length) {
      this.logger.warn('No wallets found.');
      return;
    }

    for (const coin of priorityCoins) {
      const wallet = wallets.find((w) => w.name.toLowerCase() === coin.toLowerCase());
      if (!wallet) {
        this.logger.warn(`Wallet for ${coin} not found.`);
        continue;
      }

      try {
        this.logger.log(`Attempting to trade ${coin}...`);
        const trade: Trade = {
          amount: '0.01',
          fromAssetId: 'eth', // Use appropriate asset IDs
          toAssetId: 'usdc', // Use appropriate asset IDs
        };

        const result = await this.coinbaseService.createTrade(wallet.id, trade);
        this.logger.log(`Trade successful for ${coin}: ${JSON.stringify(result)}`);
      } catch (error) {
        this.logger.error(`Error trading ${coin}: ${error.message}`, error.stack);
      }
    }
  }

  async analyzeOnly(): Promise<any[]> {
    const priorityCoins = this.coinbaseService.getPriorityCoins();
    this.logger.log(`Analyzing priority coins: ${priorityCoins.join(', ')}`);

    const wallets = await this.coinbaseService.listWallets();
    this.logger.log(`Available wallets: ${JSON.stringify(wallets)}`);

    const analysis = priorityCoins.map((coin) => {
      const wallet = wallets.find((w) => w.name.toLowerCase() === coin.toLowerCase());
      return {
        coin,
        hasWallet: !!wallet,
        walletDetails: wallet || null,
      };
    });

    return analysis;
  }

  /**
   * Get market analysis results (best short-term, best long-term, and priority coins highlighted).
   */
  async getMarketAnalysis():Promise<any> {
    return this.marketAnalysisService.analyzeMarket();
  }
}
