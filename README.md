# **Coinbase Trading Service - NestJS**

Author: **Jesse Reese**  
Website: [https://jessereese.com/](https://jessereese.com/)  
LinkedIn: [https://www.linkedin.com/in/jcreese/](https://www.linkedin.com/in/jcreese/)  
Medium: [https://medium.com/@Jesse_Reese](https://medium.com/@Jesse_Reese)  
Github: [https://github.com/messified](https://github.com/messified)


A comprehensive trading service for analyzing trading pairs, executing trades, and gathering profits. This project integrates with the Coinbase SDK and provides robust services for trading operations.

---

### **Features**

- **Trade Analysis**:
  - Analyze trading pairs based on status and 24-hour volume.
  - Prioritize pairs based on a list of preferred coins.

- **Trading Operations**:
  - Automatically execute trades for prioritized coins.
  - Integrate with Coinbase SDK for wallet and trade management.

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
   cd trading-service
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your environment variables in a `.env` file:
   ```dotenv
   COINBASE_API_KEY_NAME=your_api_key_name
   COINBASE_PRIVATE_KEY=your_private_key
   PRIORITY_COINS=BTC,ETH,SOL
   INVESTMENT=1000
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
├── api/
│   └── trading/
│       ├── trading.controller.ts   # Handles trading-related API requests
│       └── trading.controller.spec.ts  # Unit tests for TradingController
├── services/
│   ├── coinbase/
│   │   ├── coinbase.service.ts    # Manages integration with Coinbase SDK
│   │   └── coinbase.service.spec.ts  # Unit tests for CoinbaseService
│   ├── config/
│   │   ├── config.service.ts      # Provides application configuration
│   │   └── config.service.spec.ts # Unit tests for ConfigService
│   ├── profit-gathering/
│   │   ├── profit-gathering.service.ts # Handles profit gathering logic
│   │   └── profit-gathering.service.spec.ts # Unit tests for ProfitGatheringService
│   ├── trade-analysis/
│   │   ├── trade-analysis.service.ts # Provides trading pair analysis functionality
│   │   └── trade-analysis.service.spec.ts # Unit tests for TradeAnalysisService
│   └── trading/
│       ├── trading.service.ts     # Core trading service
│       └── trading.service.spec.ts # Unit tests for TradingService
├── app.module.ts                  # Main application module
├── app.controller.ts              # Root application controller
└── app.service.ts                 # Root application service
```

---

### **Development Guidelines**

1. **Testing**:
   - Write unit tests for all services and controllers.
   - Run tests frequently to ensure functionality remains intact.

2. **Code Linting**:
   - Use ESLint to maintain consistent code style.
   - Run linting:
     ```bash
     npm run lint
     ```

3. **Error Handling**:
   - Wrap all service calls in `try-catch` blocks.
   - Use `Logger` for structured logging of errors and events.

---

### **Contributing**

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

### **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
