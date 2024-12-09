export interface WalletInterface {
  id: string;
  name: string;
  defaultAddress: string;
  networkId: string;
}

export interface Transfer {
  amount: string;
  assetId: string;
  destination: WalletInterface;
  gasless?: boolean;
}

export interface Trade {
  amount: string;
  fromAssetId: string;
  toAssetId: string;
}
