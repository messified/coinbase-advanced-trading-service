import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class ProfitGatheringService {
  private profitPool = 0;

  constructor(
    @Inject('PROFIT_THRESHOLD') private readonly profitThreshold: number,
  ) {}

  calculateProfit(entryPrice: number, currentPrice: number, size: number): number {
    return (currentPrice - entryPrice) * size;
  }

  async gatherProfit(trade: any, currentPrice: number, percentage: number, executeTrade: Function) {
    const unrealizedProfit = this.calculateProfit(trade.entryPrice, currentPrice, trade.size);
    const profitToSell = unrealizedProfit * (percentage / 100);

    if (profitToSell > this.profitThreshold) {
      const sellSize = profitToSell / currentPrice;
      const result = await executeTrade(trade.productId, 'sell', sellSize);
      this.profitPool += profitToSell;

      console.log('Profit gathered:', profitToSell, 'Current Profit Pool:', this.profitPool);
      return result;
    }
    return null;
  }
}
