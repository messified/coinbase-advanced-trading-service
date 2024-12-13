export interface CoinbaseRequest {
  userAgent: string;
  contentType: string;
  token: string;
  uri: string;
}

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

export interface Product {
  product_id: string;
  price: string;
  price_percentage_change_24h: string;
  volume_24h: string;
  volume_percentage_change_24h: string;
  base_increment: string;
  quote_increment: string;
  quote_min_size: string;
  quote_max_size: string;
  base_min_size: string;
  base_max_size: string;
  base_name: string;
  quote_name: string;
  watched: boolean;
  is_disabled: boolean;
  new: boolean;
  status: string;
  cancel_only: boolean;
  limit_only: boolean;
  post_only: boolean;
  trading_disabled: boolean;
  auction_mode: boolean;
  product_type: string;
  quote_currency_id: string;
  base_currency_id: string;
  fcm_trading_session_details: null | any; // Use 'any' for flexibility; replace with appropriate type if known.
  mid_market_price: string;
  alias: string;
  alias_to: string[];
  base_display_symbol: string;
  quote_display_symbol: string;
  view_only: boolean;
  price_increment: string;
  display_name: string;
  product_venue: string;
  approximate_quote_24h_volume: string;
}

