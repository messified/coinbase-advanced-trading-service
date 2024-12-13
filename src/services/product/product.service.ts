import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { catchError, Observable, firstValueFrom } from 'rxjs';
import { CoinbaseService } from '../coinbase/coinbase.service';
import { Product } from 'src/interfaces/coinbase.interface';
import { CoinbaseRequest } from '../../interfaces/coinbase.interface';

@Injectable()
export class ProductService {
  constructor(
    private readonly httpService: HttpService,
    private readonly coinbaseService: CoinbaseService,
  ) {}

  async getProducts(): Promise<Product[]> {
    const endpoint = '/products';
    const coinbaseRequest: CoinbaseRequest = await this.coinbaseService.buildRequest(endpoint);
    
    const headers = {
      'User-Agent': coinbaseRequest.userAgent,
      'Content-Type': coinbaseRequest.contentType,
      Authorization: coinbaseRequest.token,
    };

    const response: any = await firstValueFrom(
      this.httpService.get<any[]>(coinbaseRequest.uri, { headers }).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response);
          throw 'An error happened!';
        }),
      ),
    );
    
    return response.data.products;
  }

  async getProduct(productId: string): Promise<AxiosResponse<any[]>> {
    const endpoint = `/products/${productId}`;
    const coinbaseRequest: CoinbaseRequest = await this.coinbaseService.buildRequest(endpoint);
    
    const headers = {
      'User-Agent': coinbaseRequest.userAgent,
      'Content-Type': coinbaseRequest.contentType,
      Authorization: coinbaseRequest.token,
    };

    const { response }: any = await firstValueFrom(
      this.httpService.get<any[]>(coinbaseRequest.uri, { headers }).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response);
          throw 'An error happened!';
        }),
      ),
    );

    return response.data;
  }
}
