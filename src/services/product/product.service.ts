import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, Observable, firstValueFrom } from 'rxjs';
import { CoinbaseService } from '../coinbase/coinbase.service';
import { ConfigService } from '@nestjs/config';
import { Product } from 'src/interfaces/coinbase.interface';

@Injectable()
export class ProductService {
    constructor(
        private readonly httpService: HttpService,
        private readonly coinbaseService: CoinbaseService,
        private readonly configService: ConfigService
    ) {}

    async getProducts(): Promise<Product[]> {
        const token = this.coinbaseService.generateJWT();
        const agent = this.configService.get('USER_AGENT');

        const headers = {
            'User-Agent': agent,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const { response }: any = await firstValueFrom(
        this.httpService.get<any[]>('https://api.coinbase.com/api/v3/brokerage/products', { headers }).pipe(
            catchError((error: AxiosError) => {
                console.log(error.response);
                throw 'An error happened!';
            }),
        ),
        );

        return response.data;
    }

    getProduct(productId: string): Observable<AxiosResponse<any[]>> {
        const token = this.coinbaseService.generateJWT();
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        return this.httpService.get(`https://api.coinbase.com/api/v3/brokerage/products/${productId}`, { headers });
    }
}
