import { Injectable, Logger } from '@nestjs/common';
import { CoinbaseService } from '../coinbase/coinbase.service';

interface MarketAnalysisResult {
  bestShortTermCoins: string[];
  bestLongTermCoins: string[];
  priorityCoinsHighlighted: string[];
}

/**
 * MarketAnalysisService simulates the analysis of market data to find
 * which coins/stocks have the best short-term and long-term return potential.
 * In a real-world scenario, this could involve:
 * - Historical price data analysis
 * - Volatility and momentum indicators
 * - External API calls to fetch market sentiment, fundamentals, etc.
 */
@Injectable()
export class MarketAnalysisService {
  private readonly logger = new Logger(MarketAnalysisService.name);

  constructor(private readonly coinbaseService: CoinbaseService) {}

  /**
   * Analyze the market and return a list of coins for short-term and long-term trades.
   * Also highlight priority coins.
   */
  async analyzeMarket(): Promise<MarketAnalysisResult> {
    this.logger.log('Analyzing market for short and long term opportunities...');

    // In a real scenario, you'd fetch and analyze market data here.
    // For now, let's simulate some logic.
    const allCoins = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'MATIC', 'XRP'];
    const priorityCoins = this.coinbaseService.getPriorityCoins();

    // Simulate short-term candidates (e.g., volatile and trending in the last few days)
    const bestShortTermCoins = ['ETH', 'SOL'].filter((coin) => allCoins.includes(coin));

    // Simulate long-term candidates (e.g., strong fundamentals, stable growth)
    const bestLongTermCoins = ['BTC', 'ADA', 'DOT'].filter((coin) => allCoins.includes(coin));

    // Highlight which of these are also priority coins
    const priorityCoinsHighlighted = priorityCoins.filter(
      (coin) => bestShortTermCoins.includes(coin) || bestLongTermCoins.includes(coin),
    );

    return {
      bestShortTermCoins,
      bestLongTermCoins,
      priorityCoinsHighlighted,
    };
  }
}
