# **Coinbase Trading Service - NestJS**

 - Author: **Jesse Reese**  
 - Website: [https://jessereese.com/](https://jessereese.com/)  
 - LinkedIn: [https://www.linkedin.com/in/jcreese/](https://www.linkedin.com/in/jcreese/)  
 - Medium: [https://medium.com/@Jesse_Reese](https://medium.com/@Jesse_Reese)  
 - Github: [https://github.com/messified](https://github.com/messified)

### Project Status: **Early Development**

A comprehensive trading service for analyzing trading pairs, executing trades, and gathering profits. This project integrates with the Coinbase SDK and provides robust services for trading operations.

---

### **Features**

- **Trade Analysis**:
  - Analyze trading pairs based on status and 24-hour volume.
  - Prioritize pairs based on a list of preferred coins.

- **Trading Operations**:
  - Automatically execute trades for prioritized coins.
  - Integrate with Coinbase SDK for wallet and trade management.

- **Automated Trading & Automated Profit Gathering**:
  - Automate trading, profit gathering, and or reinvesting.

- **Profit Gathering**:
  - Calculate and gather unrealized profits above a configurable threshold.
  - Simulate and execute sell trades dynamically.

---

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/trading-service.git
   ```

2. Navigate to the project directory:
   ```bash
   cd coinbase-advanced-trading-service
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your environment variables in a `.env` file:
   ```dotenv
    PRIORITY_COINS='BTC,ETH,SOL,ADA,XRP,DNT,PEPE,AMP'
    INVESTMENT=10
    COINBASE_API_KEY_NAME=''
    COINBASE_PRIVATE_KEY=''
    BASE_URL = 'api.coinbase.com';
    API_PREFIX = '/api/v3/brokerage';
    ALGORITHM = 'ES256';
    VERSION = '0.1.0';
    USER_AGENT = 'coinbase-advanced-ts/0.1.0';
    JWT_ISSUER = 'cdp';
   ```

---

### **Running the Application**

1. **Development Mode**:
   ```bash
   npm run start:dev
   ```

2. **Production Mode**:
   ```bash
   npm run build
   npm run start:prod
   ```

3. **Running Tests**:
   ```bash
   npm test
   ```

---

### **Endpoints**

#### **Trading Controller**
Base URL: `/api/trading`

- **Analyze and Trade**:  
  `GET /api/trading/analyze-and-trade`  
  Executes the analysis and trading process for priority coins.

---

### **Project Structure**

```plaintext
src/
.
├── api
│   └── trading
│       ├── trading.controller.spec.ts
│       └── trading.controller.ts
├── app.module.ts
├── interfaces
│   └── coinbase.interface.ts
├── main.ts
└── services
    ├── coinbase
    │   ├── coinbase.service.spec.ts
    │   └── coinbase.service.ts
    ├── config
    │   ├── custom-config.service.spec.ts
    │   └── custom-config.service.ts
    ├── market-analysis
    │   ├── market-analysis.service.spec.ts
    │   └── market-analysis.service.ts
    ├── products
    │   └── products.service.ts
    ├── profit-gathering
    │   ├── profit-gathering.service.spec.ts
    │   └── profit-gathering.service.ts
    ├── trade-analysis
    │   ├── trade-analysis.service.spec.ts
    │   └── trade-analysis.service.ts
    └── trading
        ├── trading.scheduler.ts
        ├── trading.service.spec.ts
        └── trading.service.ts
```

---

### **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
