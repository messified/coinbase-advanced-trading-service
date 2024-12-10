import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfigService {

  constructor(private configService: ConfigService) {}
  
  /**
   * Get the list of priority coins from the environment variable.
   * Returns an empty array if the environment variable is not set or invalid.
   */
  getPriorityCoins(): string[] {
    const priorityCoins = this.configService.get('PRIORITY_COINS');
    if (!priorityCoins) {
      console.warn('PRIORITY_COINS is not set in the environment. Returning an empty list.');
      return [];
    }
    return priorityCoins.split(',').map((coin) => coin.trim());
  }

  /**
   * Get the investment amount from the environment variable.
   * Throws an error if the environment variable is not set.
   */
  getInvestmentAmount(): number {
    const investment = this.configService.get('INVESTMENT');
    const investmentAmount = parseFloat(investment);
    if (isNaN(investmentAmount)) {
      throw new Error('INVESTMENT environment variable is not a valid number.');
    }
    return investmentAmount;
  }
}
