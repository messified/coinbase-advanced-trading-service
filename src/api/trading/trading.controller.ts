import {
  Controller,
  Get,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { TradingService } from 'src/services/trading/trading.service';

@Controller('/api/trading')
export class TradingController {
  private readonly logger = new Logger(TradingController.name);

  constructor(private readonly tradingService: TradingService) {}

  /**
   * Endpoint to trigger the analyze-and-trade process.
   * @returns A success response if the process executes without errors.
   */
  @Get('/analyze-and-trade')
  async analyzeAndTrade() {
    try {
      await this.tradingService.analyzeAndTrade();
      return {
        success: true,
        message: 'Trading process executed successfully.',
      };
    } catch (error) {
      this.logger.error('Error executing trading process:', error.message);
      throw new InternalServerErrorException(
        'An error occurred while executing the trading process.',
      );
    }
  }

  /**
   * Endpoint to analyze trading data without initiating trades.
   */
  @Get('/analyze')
  async analyze() {
    this.logger.log('Retrieving analytics data...');
    const analysis = await this.tradingService.analyzeOnly();
    return { success: true, data: analysis };
  }
}
