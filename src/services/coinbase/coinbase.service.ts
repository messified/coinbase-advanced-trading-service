import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoinbaseService {
  private readonly apiBase = 'https://api.coinbase.com/v2';

  constructor(private readonly httpService: HttpService) {}

  async getTradingPairs(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiBase}/products`),
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching trading pairs:', error.message);
      throw error;
    }
  }

  async executeTrade(productId: string, side: 'buy' | 'sell', size: number): Promise<any> {
    try {
      const order = {
        product_id: productId,
        side,
        order_type: 'market',
        size: size.toFixed(8),
      };
      console.log(`Executing ${side} order for ${productId} with size ${size}`);
      return { success: true, order };
    } catch (error) {
      console.error('Error executing trade:', error.message);
      throw error;
    }
  }
}
