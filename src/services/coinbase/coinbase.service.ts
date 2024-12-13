import { Injectable, Logger } from '@nestjs/common';
import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import {
  CoinbaseRequest,
  Trade,
  TradeResponse,
  WalletResponse,
} from '../../interfaces/coinbase.interface';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CoinbaseService {
  private readonly logger = new Logger(CoinbaseService.name);

  private readonly apiKeyName: string;
  private readonly privateKey: string;
  private readonly algorithm: string;
  private readonly requestMethod = 'GET';
  private readonly requestHost: string;
  private readonly requestPath: string;
  private readonly userAgent: string;
  private readonly contentType: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKeyName = this.configService.get('COINBASE_API_KEY_NAME');
    this.privateKey = this.configService.get('COINBASE_PRIVATE_KEY');
    this.algorithm = this.configService.get('ALGORITHM');
    this.requestHost = this.configService.get('REQUEST_HOST');
    this.requestPath = this.configService.get('REQUEST_PATH');
    this.userAgent = this.configService.get('USER_AGENT');
    this.contentType = this.configService.get('CONTENT_TYPE');

    if (!this.apiKeyName || !this.privateKey) {
      throw new Error('Coinbase API key name or private key missing');
    }

    // Configure Coinbase with the provided credentials
    Coinbase.configure({
      apiKeyName: this.apiKeyName,
      privateKey: this.privateKey,
    });
  }

  async buildRequest(endpoint: string, params = null): Promise<CoinbaseRequest> {
    const hash = await this.generateJWT(endpoint);
    const token = `Bearer ${hash}`;
    const uri = `https://${this.requestHost}${this.requestPath}${endpoint}`;

    return {
      userAgent: this.userAgent,
      contentType: this.contentType,
      token,
      uri,
    };
  }

  async generateJWT(endpoint: string): Promise<string> {
    const uri = `${this.requestMethod} ${this.requestHost}${this.requestPath}${endpoint}`;
    const payload = {
      iss: 'cdp',
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: this.apiKeyName,
      uri: uri,
    };

    const header = {
      alg: this.algorithm,
      kid: this.apiKeyName,
      nonce: crypto.randomBytes(16).toString('hex'),
    };

    // For ES256 (ECDSA), privateKey should be an appropriate ECDSA key.
    // The `jwt.sign` options object requires named keys, not `this.algorithm` inline.
    const options: jwt.SignOptions = {
      algorithm: 'ES256' as jwt.Algorithm,
      header,
    };

    return jwt.sign(payload, this.privateKey, options);
  }

  async listWallets(): Promise<WalletResponse[]> {
    try {
      const response = await Wallet.listWallets();
      return response.data.map(
        (wallet: any): WalletResponse => ({
          id: wallet.id,
          name: wallet.name || '',
          defaultAddress: wallet.defaultAddress || '',
          networkId: wallet.networkId,
        }),
      );
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
      this.logger.error(
        `Error creating trade for wallet ID: ${walletId}`,
        error.message,
      );
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

    /**
   * Get the list of priority coins from the environment variable.
   * Returns an empty array if the environment variable is not set or invalid.
   */
    getPriorityCoins(): string[] {
      const priorityCoins = this.configService.get('PRIORITY_COINS');
      if (!priorityCoins) {
        console.warn('PRIORITY_COINS is not set in the environment. Returning an empty list.');
        return [];
      }
      return priorityCoins.split(',').map((coin) => coin.trim());
    }
  
    /**
     * Get the investment amount from the environment variable.
     * Throws an error if the environment variable is not set.
     */
    getInvestmentAmount(): number {
      const investment = this.configService.get('INVESTMENT');
      const investmentAmount = parseFloat(investment);
      if (isNaN(investmentAmount)) {
        throw new Error('INVESTMENT environment variable is not a valid number.');
      }
      return investmentAmount;
    }
}
