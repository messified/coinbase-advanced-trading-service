import { Test, TestingModule } from '@nestjs/testing';
import { TradeAnalysisService } from './trade-analysis.service';

describe('TradeAnalysisService', () => {
  let service: TradeAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeAnalysisService],
    }).compile();

    service = module.get<TradeAnalysisService>(TradeAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
