import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getPriorityCoins(): string[] {
    return process.env.PRIORITY_COINS?.split(',') || [];
  }

  getInvestmentAmount(): string {
    return process.env.INVESTMENT;
  }
}
