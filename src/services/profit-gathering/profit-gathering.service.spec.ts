import { ProfitGatheringService } from './profit-gathering.service';

describe('ProfitGatheringService', () => {
  let service: ProfitGatheringService;

  beforeEach(() => {
    service = new ProfitGatheringService(10); // Set profit threshold to 10
  });

  it('should calculate profit correctly', () => {
    const profit = service.calculateProfit(100, 150, 2);
    expect(profit).toBe(100); // (150 - 100) * 2
  });

  it('should gather profit if above threshold', async () => {
    const mockTrade = { entryPrice: 100, size: 2, productId: 'BTC-USD' };
    const mockExecuteTrade = jest.fn().mockResolvedValue({ success: true });

    const result = await service.gatherProfit(mockTrade, 150, 50, mockExecuteTrade);

    expect(result).toEqual({ success: true });
    expect(mockExecuteTrade).toHaveBeenCalledWith('BTC-USD', 'sell', expect.any(Number));
    expect(service['profitPool']).toBeGreaterThan(10);
  });

  it('should not gather profit if below threshold', async () => {
    const mockTrade = { entryPrice: 100, size: 2, productId: 'BTC-USD' };
    const mockExecuteTrade = jest.fn();

    const result = await service.gatherProfit(mockTrade, 105, 50, mockExecuteTrade);

    expect(result).toBeNull();
    expect(mockExecuteTrade).not.toHaveBeenCalled();
  });
});
