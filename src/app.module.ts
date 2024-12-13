import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TradingController } from './api/trading/trading.controller';
import { CoinbaseService } from './services/coinbase/coinbase.service';
import { ProfitGatheringService } from './services/profit-gathering/profit-gathering.service';
import { TradeAnalysisService } from './services/trade-analysis/trade-analysis.service';
import { TradingService } from './services/trading/trading.service';
import { MarketAnalysisService } from './services/market-analysis/market-analysis.service';
import { ProductService } from './services/product/product.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [TradingController],
  providers: [
    CoinbaseService,
    TradeAnalysisService,
    {
      provide: 'PROFIT_THRESHOLD',
      useValue: 10, // Configure the profit threshold value here
    },
    ProfitGatheringService,
    MarketAnalysisService,
    TradingService,
    ProductService,
  ],
})
export class AppModule {}
