
# NestJS Crypto Trading Service

A NestJS service designed to automate cryptocurrency trading using the Coinbase API. 
This project includes functionality to analyze available trading pairs, prioritize specific coins, execute trades, and gather profits.

## Features

- **Coinbase API Integration**: Fetch and analyze tradable cryptocurrency pairs.
- **Trading Pair Analysis**: Prioritize trading pairs based on liquidity and user preferences.
- **Profit-Gathering Logic**: Automatically sell a percentage of profits and accumulate them for personal use.
- **Customizable Preferences**: Set specific cryptocurrencies to prioritize for trading via `.env` configuration.
- **Cron Jobs**: Automate periodic trading and profit-gathering tasks.

---

## Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- Coinbase Developer Account (API key access)
- TypeScript (pre-installed with NestJS CLI)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/nestjs-crypto-trading-service.git
   cd nestjs-crypto-trading-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables in `.env`:
   ```env
   PRIORITY_COINS=BTC,ETH,SOL,ADA
   ```

4. Start the application:
   ```bash
   npm run start
   ```

---

## Usage

1. **Analyze and Trade**:
   Access the trading endpoint via HTTP:
   ```bash
   GET http://localhost:3000/trading/analyze-and-trade
   ```

2. **Profit Monitoring**:
   Profits are automatically gathered and logged to the console.

---

## Project Structure

```
nestjs-crypto-trading-service
├── src
│   ├── controllers
│   │   └── trading.controller.ts   # Handles trading-related HTTP endpoints
│   ├── services
│   │   ├── coinbase.service.ts     # Coinbase API integration
│   │   ├── config.service.ts       # Manages environment configurations
│   │   ├── profit-gathering.service.ts # Handles profit-gathering logic
│   │   ├── trade-analysis.service.ts  # Analyzes trading pairs
│   │   └── trading.service.ts      # Main trading workflow logic
│   ├── app.module.ts               # Root application module
│   └── main.ts                     # Application bootstrap file
├── .env                            # Environment configuration
├── package.json                    # Dependency management
└── README.md                       # Project documentation
```

---

## Customization

- **Priority Coins**: Edit the `PRIORITY_COINS` value in `.env` to specify coins to prioritize for trading.
- **Profit-Gathering Percentage**: Update the logic in `profit-gathering.service.ts` to adjust the percentage of profits gathered.

---

## Roadmap

- Add real-time WebSocket support for price monitoring.
- Implement backtesting with historical data.
- Enhance profit tracking with a persistent database.

---

## License

This project is licensed under the MIT License.
