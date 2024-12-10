import { Injectable } from '@nestjs/common';

interface Pair {
  base_currency: string;
  status: string;
  volume_24h: number;
}

@Injectable()
export class TradeAnalysisService {
  /**
   * Filters trading pairs that are online and have a 24-hour volume above the threshold.
   * @param pairs - Array of trading pairs.
   * @param volumeThreshold - Minimum volume for filtering (default: 100,000).
   * @returns Filtered array of trading pairs.
   */
  analyzePairs(pairs: Pair[], volumeThreshold: number = 100000): Pair[] {
    if (!Array.isArray(pairs)) {
      throw new Error('Invalid input: pairs must be an array.');
    }

    return pairs.filter(
      (pair) =>
        pair.status === 'online' &&
        pair.volume_24h > volumeThreshold
    );
  }

  /**
   * Prioritizes trading pairs based on a list of priority coins and sorts them by 24-hour volume.
   * @param pairs - Array of trading pairs.
   * @param priorityCoins - Array of priority coin base currencies.
   * @returns Prioritized and sorted array of trading pairs.
   */
  prioritizePairs(pairs: Pair[], priorityCoins: string[]): Pair[] {
    if (!Array.isArray(pairs) || !Array.isArray(priorityCoins)) {
      throw new Error('Invalid input: pairs and priorityCoins must be arrays.');
    }

    return pairs
      .filter((pair) => priorityCoins.includes(pair.base_currency))
      .sort((a, b) => b.volume_24h - a.volume_24h);
  }
}
