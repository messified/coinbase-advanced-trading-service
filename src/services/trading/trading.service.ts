import { Injectable } from '@nestjs/common';
import { CoinbaseService } from '../coinbase/coinbase.service';
import { TradeAnalysisService } from '../trade-analysis/trade-analysis.service';
import { ProfitGatheringService } from '../profit-gathering/profit-gathering.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class TradingService {
  constructor(
    private readonly coinbaseService: CoinbaseService,
    private readonly tradeAnalysisService: TradeAnalysisService,
    private readonly profitGatheringService: ProfitGatheringService,
    private readonly configService: ConfigService,
  ) {}

  async analyzeAndTrade() {
    const allPairs = await this.coinbaseService.getTradingPairs();
    const analyzedPairs = this.tradeAnalysisService.analyzePairs(allPairs);
    const priorityCoins = this.configService.getPriorityCoins();
    const optimalPairs = this.tradeAnalysisService.prioritizePairs(analyzedPairs, priorityCoins);

    for (const pair of optimalPairs) {
      const currentPrice = parseFloat(pair.price);
      const entryPrice = currentPrice * 0.95;
      const size = 0.01;

      await this.coinbaseService.executeTrade(pair.id, 'buy', size);

      await this.profitGatheringService.gatherProfit(
        { productId: pair.id, entryPrice, size },
        currentPrice,
        5,
        this.coinbaseService.executeTrade.bind(this.coinbaseService),
      );
    }
  }
}
