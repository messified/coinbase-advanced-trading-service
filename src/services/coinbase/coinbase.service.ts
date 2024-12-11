import { Injectable, Logger } from '@nestjs/common';
import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import { Trade, TradeResponse, WalletResponse } from '../../interfaces/coinbase.interface';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CoinbaseService {
  private readonly logger = new Logger(CoinbaseService.name);

  private readonly apiKeyName: string;
  private readonly privateKey: string;
  private readonly algorithm = 'ES256';
  private readonly requestMethod = 'GET';
  private readonly requestHost = 'api.coinbase.com';
  private readonly requestPath = '/api/v3/brokerage/accounts';
  private readonly uri: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKeyName = this.configService.get('COINBASE_API_KEY_NAME');
    this.privateKey = this.configService.get('COINBASE_PRIVATE_KEY');

    if (!this.apiKeyName || !this.privateKey) {
      throw new Error('Coinbase API key name or private key missing');
    }

    this.uri = `${this.requestMethod} ${this.requestHost}${this.requestPath}`;

    // Configure Coinbase with the provided credentials
    Coinbase.configure({ apiKeyName: this.apiKeyName, privateKey: this.privateKey });
  }

  async generateJWT(): Promise<string> {
    const payload = {
      iss: 'cdp',
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: this.apiKeyName,
      uri: this.uri,
    };

    const header = {
      alg: this.algorithm,
      kid: this.apiKeyName,
      nonce: crypto.randomBytes(16).toString('hex'),
    };

    // For ES256 (ECDSA), privateKey should be an appropriate ECDSA key.
    // The `jwt.sign` options object requires named keys, not `this.algorithm` inline.
    const options: jwt.SignOptions = {
      algorithm: this.algorithm as jwt.Algorithm,
      header,
    };

    return jwt.sign(payload, this.privateKey, options);
  }

  async listWallets(): Promise<WalletResponse[]> {
    try {
      const response = await Wallet.listWallets();
      return response.data.map((wallet: any): WalletResponse => ({
        id: wallet.id,
        name: wallet.name || '',
        defaultAddress: wallet.defaultAddress || '',
        networkId: wallet.networkId,
      }));
    } catch (error) {
      this.logger.error('Error listing wallets:', error.message);
      throw error;
    }
  }

  async createTrade(walletId: string, trade: Trade): Promise<TradeResponse> {
    try {
      const wallet = await Wallet.fetch(walletId);
      let transaction = await wallet.createTrade({
        amount: parseFloat(trade.amount),
        fromAssetId: trade.fromAssetId,
        toAssetId: trade.toAssetId,
      });
      transaction = await transaction.wait();
      return this.mapTradeResponse(transaction);
    } catch (error) {
      this.logger.error(`Error creating trade for wallet ID: ${walletId}`, error.message);
      throw error;
    }
  }

  async createWallet(): Promise<WalletResponse> {
    try {
      const wallet = await Wallet.create();
      return this.mapWalletResponse(wallet);
    } catch (error) {
      this.logger.error('Error creating wallet:', error.message);
      throw error;
    }
  }

  private mapWalletResponse(wallet: any): WalletResponse {
    if (!wallet.id || !wallet.networkId) {
      throw new Error('Invalid wallet response from SDK');
    }
    return {
      id: wallet.id,
      name: wallet.name || '',
      defaultAddress: wallet.defaultAddress || '',
      networkId: wallet.networkId,
    };
  }

  private mapTradeResponse(trade: any): TradeResponse {
    if (!trade.id || !trade.status) {
      throw new Error('Invalid trade response from SDK');
    }
    return {
      id: trade.id,
      status: trade.status,
      amount: trade.amount,
      fromAssetId: trade.fromAssetId,
      toAssetId: trade.toAssetId,
    };
  }
}
