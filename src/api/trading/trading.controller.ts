import {
  Controller,
  Get,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { TradingService } from 'src/services/trading/trading.service';
import { ProductsService } from '../../services/products/products.service';

@Controller('/api/trading')
export class TradingController {
  private readonly logger = new Logger(TradingController.name);

  constructor(
    private readonly tradingService: TradingService,
    private readonly productsService: ProductsService
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

  /**
   * DEV ONLY
   * @returns
   */
  @Get('/products')
  async testPoint() {
    this.logger.log('Retrieving Product data...');
    const response = await this.productsService.getProducts();
    console.log(response);
    return { success: true, data: response };
  }
}
