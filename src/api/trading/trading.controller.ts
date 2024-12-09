import { Controller, Get } from '@nestjs/common';
import { TradingService } from 'src/services/trading/trading.service';

@Controller('/api/trading')
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  @Get('/analyze-and-trade')
  async analyzeAndTrade() {
    await this.tradingService.analyzeAndTrade();
    
    return { success: true, message: 'Trading process executed.' };
  }
}
