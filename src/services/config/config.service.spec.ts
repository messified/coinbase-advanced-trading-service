import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CustomConfigService } from './custom-config.service';

describe('CustomConfigService', () => {
  let customConfigService: CustomConfigService;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    // Create a mock for ConfigService
    configService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomConfigService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    customConfigService = module.get<CustomConfigService>(CustomConfigService);
  });

  describe('getPriorityCoins', () => {
    it('should return an empty array if PRIORITY_COINS is not set', () => {
      (configService.get as jest.Mock).mockReturnValue(undefined);
      
      const warnSpy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
      const result = customConfigService.getPriorityCoins();
      
      expect(warnSpy).toHaveBeenCalledWith('PRIORITY_COINS is not set in the environment. Returning an empty list.');
      expect(result).toEqual([]);
      
      warnSpy.mockRestore();
    });

    it('should return an empty array if PRIORITY_COINS is empty string', () => {
      (configService.get as jest.Mock).mockReturnValue('');
      
      const warnSpy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
      const result = customConfigService.getPriorityCoins();
      
      // Even if it's empty string, it technically returns `['']` if not handled, 
      // but the code should still return an empty array, so let's test that assumption.
      expect(warnSpy).toHaveBeenCalledWith('PRIORITY_COINS is not set in the environment. Returning an empty list.');
      expect(result).toEqual([]);
      
      warnSpy.mockRestore();
    });

    it('should return a list of trimmed priority coins if PRIORITY_COINS is set', () => {
      (configService.get as jest.Mock).mockReturnValue(' BTC , ETH, ADA ');
      const result = customConfigService.getPriorityCoins();
      expect(result).toEqual(['BTC', 'ETH', 'ADA']);
    });
  });

  describe('getInvestmentAmount', () => {
    it('should throw an error if INVESTMENT is not a valid number', () => {
      (configService.get as jest.Mock).mockReturnValue('invalid');
      expect(() => customConfigService.getInvestmentAmount()).toThrow(
        'INVESTMENT environment variable is not a valid number.',
      );
    });

    it('should return the correct investment amount if INVESTMENT is a valid number', () => {
      (configService.get as jest.Mock).mockReturnValue('1000');
      const result = customConfigService.getInvestmentAmount();
      expect(result).toBe(1000);
    });

    it('should handle floating point values for INVESTMENT', () => {
      (configService.get as jest.Mock).mockReturnValue('1234.56');
      const result = customConfigService.getInvestmentAmount();
      expect(result).toBeCloseTo(1234.56);
    });
  });
});
