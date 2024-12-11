import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { CoinbaseService } from '../coinbase/coinbase.service';

@Injectable()
export class ProductsService {
    constructor(
        private readonly httpService: HttpService,
        private readonly coinbaseService: CoinbaseService
    ) {}

    getProducts(): Observable<AxiosResponse<any[]>> {
        const token = this.coinbaseService.generateJWT();
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        return this.httpService.get('https://api.coinbase.com/api/v3/brokerage/products', { headers });
    }

    getProduct(productId: string): Observable<AxiosResponse<any[]>> {
        const token = this.coinbaseService.generateJWT();
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        return this.httpService.get(`https://api.coinbase.com/api/v3/brokerage/products/${productId}`, { headers });
    }
}
