# 🔗 FarmChain Blockchain

Smart contracts for the FarmChain agricultural supply chain tracking system, built with Solidity and Hardhat.

---

## 📋 Overview

The FarmChain blockchain layer provides immutable, transparent tracking of agricultural produce through the entire supply chain using Ethereum smart contracts.

### **Smart Contract: SupplyChain.sol**

Core functionality:
- ✅ **Batch Creation**: Farmers register new agricultural batches
- ✅ **Ownership Transfer**: Track product movement through supply chain
- ✅ **Status Updates**: Real-time batch status tracking
- ✅ **Quality Reports**: Add inspection and quality grades
- ✅ **Complete History**: Immutable record of all transactions
- ✅ **Public Verification**: Anyone can verify batch authenticity

---

## 🛠️ Technology Stack

- **Solidity**: ^0.8.19
- **Hardhat**: Development environment
- **OpenZeppelin**: Security-audited contract libraries
- **Ethers.js**: Ethereum interaction
- **Chai**: Testing framework

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.blockchain.example .env
# Edit .env with your credentials
```

Required environment variables:
```env
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### 3. Compile Contracts

```bash
npx hardhat compile
```

### 4. Run Tests

```bash
npx hardhat test
```

### 5. Deploy to Local Network

```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.js --network localhost
```

### 6. Deploy to Testnet (Sepolia)

```bash
# Make sure you have testnet ETH
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 📝 Smart Contract API

### **addBatch**
```solidity
function addBatch(
    string memory _batchId,
    string memory _cropType,
    uint256 _quantity,
    string memory _qualityGrade
) external
```
Creates a new batch. Only callable once per batch ID.

### **transferOwnership**
```solidity
function transferOwnership(
    string memory _batchId,
    address _newOwner
) external
```
Transfers batch ownership. Only current owner can call.

### **updateBatchStatus**
```solidity
function updateBatchStatus(
    string memory _batchId,
    string memory _status
) external
```
Updates batch status. Only owner can call.

### **addQualityReport**
```solidity
function addQualityReport(
    string memory _batchId,
    string memory _grade
) external
```
Adds quality inspection report. Anyone can call.

### **verifyBatch**
```solidity
function verifyBatch(
    string memory _batchId
) external view returns (
    bool exists,
    address currentOwner,
    string memory status
)
```
Public verification function. No authentication required.

### **getBatchHistory**
```solidity
function getBatchHistory(
    string memory _batchId
) external view returns (address[] memory)
```
Returns complete ownership history.

### **getBatchStatusHistory**
```solidity
function getBatchStatusHistory(
    string memory _batchId
) external view returns (string[] memory)
```
Returns all status changes.

---

## 🧪 Testing

### Run All Tests
```bash
npx hardhat test
```

### Test with Gas Report
```bash
REPORT_GAS=true npx hardhat test
```

### Test Coverage
```bash
npx hardhat coverage
```

### Test Results

```
SupplyChain Contract
  ✓ Should deploy successfully
  ✓ Should create a new batch
  ✓ Should transfer ownership
  ✓ Should update batch status
  ✓ Should add quality report
  ✓ Should verify batch
  ✓ Should track complete supply chain journey

All tests passing! ✅
```

---

## 📜 Available Scripts

```json
{
  "compile": "Compile smart contracts",
  "test": "Run test suite",
  "deploy:local": "Deploy to local Hardhat network",
  "deploy:sepolia": "Deploy to Sepolia testnet",
  "node": "Start local blockchain node",
  "clean": "Clean artifacts and cache",
  "verify": "Verify contract on Etherscan"
}
```

---

## 🌍 Supported Networks

### **Local Development**
- **Network**: Hardhat
- **ChainId**: 1337
- **RPC**: http://127.0.0.1:8545
- **Use**: Local testing

### **Ethereum Sepolia (Testnet)**
- **Network**: Sepolia
- **ChainId**: 11155111
- **RPC**: Infura/Alchemy
- **Faucet**: https://sepoliafaucet.com/
- **Explorer**: https://sepolia.etherscan.io/

### **Polygon Mumbai (Testnet)**
- **Network**: Mumbai
- **ChainId**: 80001
- **RPC**: Polygon RPC
- **Faucet**: https://faucet.polygon.technology/
- **Explorer**: https://mumbai.polygonscan.com/

---

## 📦 Deployment

### Local Deployment

```bash
# Start local node (Terminal 1)
npx hardhat node

# Deploy (Terminal 2)
npx hardhat run scripts/deploy.js --network localhost

# Test interaction
npx hardhat run scripts/interact.js --network localhost
```

### Testnet Deployment

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Deployment Output

```
🚀 Starting FarmChain Smart Contract Deployment...

📋 Deployment Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Network: sepolia
Deployer: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1
Balance: 0.5 ETH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Deploying SupplyChain contract...
✅ SupplyChain deployed successfully!
📍 Contract Address: 0x...

📝 Deployment Info Saved:
   File: deployments/sepolia.json

✅ Backend .env updated with contract address

✅ Deployment Complete! 🎉
```

---

## 🔐 Security Features

### **OpenZeppelin Contracts**
- `Ownable`: Access control
- `ReentrancyGuard`: Reentrancy protection

### **Input Validation**
- Non-empty strings
- Valid addresses
- Positive quantities
- Existence checks

### **Access Control**
- Owner-only functions
- Modifier-based permissions
- Transfer restrictions

### **Best Practices**
- ✅ No external calls
- ✅ Checks-Effects-Interactions pattern
- ✅ Explicit visibility
- ✅ Comprehensive events
- ✅ Gas optimization

---

## 📊 Gas Usage

Typical gas costs (estimated):

| Function | Gas Used |
|----------|----------|
| addBatch | ~150,000 |
| transferOwnership | ~80,000 |
| updateBatchStatus | ~60,000 |
| addQualityReport | ~50,000 |
| verifyBatch (view) | 0 (read-only) |
| getBatchHistory (view) | 0 (read-only) |

*Gas costs vary based on data size and network conditions*

---

## 🔍 Contract Verification

After deployment, verify on block explorer:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

Or use the script:
```bash
npx hardhat run scripts/verify.js --network sepolia
```

---

## 📁 Project Structure

```
/
├── contracts/
│   └── SupplyChain.sol        # Main smart contract
├── scripts/
│   ├── deploy.js              # Deployment script
│   ├── verify.js              # Verification script
│   └── interact.js            # Interaction examples
├── test/
│   └── SupplyChain.test.js    # Comprehensive tests
├── deployments/               # Deployment records (gitignored)
│   ├── localhost.json
│   └── sepolia.json
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

---

## 🐛 Troubleshooting

### **Issue: Insufficient Funds**
```
Solution: Get testnet ETH from faucet
- Sepolia: https://sepoliafaucet.com/
- Mumbai: https://faucet.polygon.technology/
```

### **Issue: Nonce Too High**
```bash
Solution: Reset account in MetaMask
Settings → Advanced → Reset Account
```

### **Issue: Contract Already Deployed**
```bash
Solution: Use existing deployment or change contract
Check deployments/ folder for existing addresses
```

### **Issue: Gas Estimation Failed**
```
Solution: Check:
1. Contract compiles without errors
2. Function parameters are valid
3. Sufficient balance for gas
4. Network connection is stable
```

---

## 🔗 Integration with Backend

After deployment:

1. **Contract address** is automatically saved to `backend/.env`
2. **ABI** is available in `artifacts/contracts/SupplyChain.sol/SupplyChain.json`
3. **Backend blockchain service** (`backend/config/blockchain.js`) connects automatically

Backend integration:
```javascript
const blockchainService = require('./config/blockchain');

// Initialize
await blockchainService.initialize();

// Add batch to blockchain
const result = await blockchainService.addBatch(
  batchId,
  cropType,
  quantity,
  qualityGrade
);

// Verify batch
const verification = await blockchainService.verifyBatch(batchId);
```

---

## 📚 Learning Resources

- **Hardhat Docs**: https://hardhat.org/docs
- **Solidity Docs**: https://docs.soliditylang.org/
- **OpenZeppelin**: https://docs.openzeppelin.com/
- **Ethers.js**: https://docs.ethers.org/
- **Ethereum**: https://ethereum.org/developers

---

## 🎯 Next Steps

1. ✅ Deploy to local network and test
2. ✅ Deploy to Sepolia testnet
3. → Integrate with backend API
4. → Test complete flow (frontend → backend → blockchain)
5. → Add event listeners in backend
6. → Implement IPFS for large data (optional)
7. → Deploy to mainnet (production)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Support

- **Documentation**: `/docs`
- **Issues**: GitHub Issues
- **Email**: support@farmchain.in

---

**Built with ❤️ for transparent agriculture** 🌾⛓️
