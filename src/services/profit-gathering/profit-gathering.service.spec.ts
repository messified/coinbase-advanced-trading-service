import { Test, TestingModule } from '@nestjs/testing';
import { ProfitGatheringService } from './profit-gathering.service';

describe('ProfitGatheringService', () => {
  let service: ProfitGatheringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfitGatheringService],
    }).compile();

    service = module.get<ProfitGatheringService>(ProfitGatheringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
