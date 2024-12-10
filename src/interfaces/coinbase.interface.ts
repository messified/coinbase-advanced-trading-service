export interface Trade {
  amount: string; // or number, depending on SDK
  fromAssetId: string;
  toAssetId: string;
}

export interface TradeResponse {
  id: string;
  status: string;
  amount: string;
  fromAssetId: string;
  toAssetId: string;
}

export interface Wallet {
  id: string;
  name?: string;
  defaultAddress?: string;
  networkId: string;
}

export interface WalletResponse {
  id: string;
  name?: string;
  defaultAddress?: string;
  networkId: string;
}
