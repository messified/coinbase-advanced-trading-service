import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoinbaseService } from './services/coinbase/coinbase.service';
import { ProfitGatheringService } from './services/profit-gathering/profit-gathering.service';
import { ConfigService } from './services/config/config.service';
import { TradingService } from './services/trading/trading.service';
import { TradeAnalysisService } from './services/trade-analysis/trade-analysis.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TradingController } from './api/trading/trading.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule
  ],
  controllers: [AppController, TradingController],
  providers: [
    CoinbaseService,
    TradeAnalysisService,
    ProfitGatheringService,
    ConfigService,
    TradingService,
    AppService
  ],
})
export class AppModule {}
