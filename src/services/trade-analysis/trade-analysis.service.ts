import { Injectable } from '@nestjs/common';

@Injectable()
export class TradeAnalysisService {
  analyzePairs(pairs: any[]): any[] {
    return pairs.filter(pair => pair.status === 'online' && pair.volume_24h > 100000);
  }

  prioritizePairs(pairs: any[], priorityCoins: string[]): any[] {
    return pairs
      .filter(pair => priorityCoins.includes(pair.base_currency))
      .sort((a, b) => b.volume_24h - a.volume_24h);
  }
}
