import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  /**
   * Generic method to retrieve a configuration value by key.
   * Throws an error if the key does not exist.
   */
  get(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Configuration key "${key}" is not set in the environment.`);
    }
    return value;
  }

  /**
   * Get the list of priority coins from the environment variable.
   * Returns an empty array if the environment variable is not set or invalid.
   */
  getPriorityCoins(): string[] {
    const priorityCoins = process.env.PRIORITY_COINS;
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
    const investment = this.get('INVESTMENT');
    const investmentAmount = parseFloat(investment);
    if (isNaN(investmentAmount)) {
      throw new Error('INVESTMENT environment variable is not a valid number.');
    }
    return investmentAmount;
  }
}
