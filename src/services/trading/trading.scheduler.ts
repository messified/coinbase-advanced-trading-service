
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TradingService } from './trading.service';

@Injectable()
export class TradingScheduler {
  private readonly logger = new Logger(TradingScheduler.name);

  constructor(private readonly tradingService: TradingService) {}

  @Cron('0 */15 * * * *') // Run every 15 minutes
  async scheduleTrading() {
    this.logger.log('Starting trading cycle...');
    try {
      await this.tradingService.analyzeAndTrade(); // Fixed method reference
      this.logger.log('Trading cycle complete.');
    } catch (error) {
      this.logger.error('Error during trading cycle:', error.message);
    }
  }
}
