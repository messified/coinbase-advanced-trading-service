import {
  Controller,
  Get,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CoinbaseService } from 'src/services/coinbase/coinbase.service';
import { TradingService } from 'src/services/trading/trading.service';

@Controller('/api/trading')
export class TradingController {
  private readonly logger = new Logger(TradingController.name);

  constructor(
    private readonly tradingService: TradingService,
    private readonly coinbaseService: CoinbaseService
  ) {}

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

  @Get('/analyze')
  async analyze() {
    this.logger.log('Retrieving analytics data...');
    const analysis = await this.tradingService.analyzeOnly();
    return { success: true, data: analysis };
  }

  /**
   * New endpoint to get market analysis data.
   */
  @Get('/market-analysis')
  async marketAnalysis() {
    this.logger.log('Retrieving market analysis data...');
    try {
      const analysis = await this.tradingService.getMarketAnalysis();
      return { success: true, data: analysis };
    } catch (error) {
      this.logger.error('Error retrieving market analysis data:', error.message);
      throw new InternalServerErrorException(
        'An error occurred while retrieving market analysis data.',
      );
    }
  }

  @Get('/jwt-token')
  async getJwtToken() {
    try {
      return this.coinbaseService.generateJWT();
    } catch (error) {
        throw new InternalServerErrorException('An error occurred while retrieving a JWT Token.')
    }
  }
}
