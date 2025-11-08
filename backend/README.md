# FarmChain Backend API

🌾 **Smart Agriculture Supply Chain Tracker - Backend API**

A robust Node.js/Express.js backend with PostgreSQL database and blockchain integration for tracking agricultural produce through the entire supply chain.

---

## 🚀 Features

- ✅ **RESTful API** with Express.js
- ✅ **PostgreSQL Database** with connection pooling
- ✅ **JWT Authentication** with role-based access control
- ✅ **Blockchain Integration** via Ethers.js
- ✅ **QR Code Generation** for batch verification
- ✅ **Input Validation** with express-validator
- ✅ **Error Handling** with custom error middleware
- ✅ **Security** with Helmet, CORS, rate limiting
- ✅ **Logging** with Winston and Morgan
- ✅ **Database Models** for Users, Batches, Transactions, Quality Reports

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v14 or higher)
- **Git**

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/FarmChain.git
cd FarmChain/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

**Option A: Automated Setup (Recommended)**

```bash
cd database
./setup.sh
```

**Option B: Manual Setup**

```bash
# Create database
psql -U postgres -c "CREATE DATABASE agri_supply_chain;"

# Run schema
psql -U postgres -d agri_supply_chain -f database/schema.sql

# Load seed data (optional)
psql -U postgres -d agri_supply_chain -f database/seeds.sql
```

### 4. Environment Configuration

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agri_supply_chain
DB_USER=postgres
DB_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# Blockchain Configuration (optional for now)
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=deployed_contract_address

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 5. Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # PostgreSQL connection pool
│   ├── logger.js            # Winston logger configuration
│   └── blockchain.js        # Blockchain service (Ethers.js)
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handler
│   └── validation.js        # Request validation rules
├── models/
│   ├── User.js              # User model
│   ├── Batch.js             # Batch model
│   ├── Transaction.js       # Transaction model
│   ├── QualityReport.js     # Quality Report model
│   └── index.js             # Model exports
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   ├── batchRoutes.js       # Batch management
│   ├── transactionRoutes.js # Transaction tracking
│   ├── qualityReportRoutes.js # Quality reports
│   ├── blockchainRoutes.js  # Blockchain interactions
│   ├── analyticsRoutes.js   # Analytics & stats
│   └── userRoutes.js        # User management
├── services/
│   └── (utility services)
├── database/
│   ├── schema.sql           # Database schema
│   ├── seeds.sql            # Sample data
│   ├── setup.sh             # Setup script
│   └── README.md            # Database documentation
├── logs/
│   └── (application logs)
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── server.js                # Express app entry point
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

### Batches

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/batches` | Create new batch | Yes | Farmer |
| GET | `/api/batches` | Get all batches | Yes | All |
| GET | `/api/batches/:id` | Get batch by ID | Yes | All |
| PUT | `/api/batches/:id` | Update batch | Yes | Farmer |
| DELETE | `/api/batches/:id` | Delete batch | Yes | Admin |
| GET | `/api/batches/:id/verify` | Public verification | No | Public |

### Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/transactions` | Create transaction | Yes |
| GET | `/api/transactions` | Get all transactions | Yes |
| GET | `/api/transactions/batch/:batchId` | Get batch transactions | Yes |
| POST | `/api/transactions/transfer` | Transfer ownership | Yes |

### Quality Reports

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/reports` | Create quality report | Yes | Retailer/Admin |
| GET | `/api/reports/batch/:batchId` | Get batch reports | Yes | All |
| PUT | `/api/reports/:id` | Update report | Yes | Inspector |

### Blockchain

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blockchain/verify/:batchId` | Verify on blockchain | No |
| GET | `/api/blockchain/history/:batchId` | Get blockchain history | No |
| POST | `/api/blockchain/sync` | Sync with blockchain | Yes (Admin) |

### Analytics (Admin)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/analytics/overview` | System statistics | Yes | Admin |
| GET | `/api/analytics/farmers` | Farmer metrics | Yes | Admin |
| GET | `/api/analytics/supply-chain` | Supply chain data | Yes | Admin |

---

## 🧪 Testing

### Test Credentials (from seed data)

```
Farmer:
  Email: ramesh@farm.in
  Password: password123

Distributor:
  Email: dist@quicktransport.in
  Password: password123

Retailer:
  Email: retail@freshmart.in
  Password: password123

Admin:
  Email: admin@farmchain.in
  Password: password123
```

### Using curl

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "farmer",
    "phone": "9876543210",
    "location": "Test Location"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ramesh@farm.in",
    "password": "password123"
  }'
```

**Get Batches (with token):**
```bash
curl -X GET http://localhost:5000/api/batches \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS Protection**: Configured whitelist
- **Helmet**: Security headers
- **SQL Injection Prevention**: Parameterized queries
- **Input Validation**: Express-validator
- **Role-Based Access Control**: Middleware-based permissions

---

## 🗄️ Database Models

### User
- user_id, name, email, password_hash, role, phone, location, wallet_address
- Roles: farmer, distributor, retailer, admin

### Batch
- batch_id (AG-YYYY-XXXXXX), farmer_id, crop_type, quantity, unit, harvest_date
- quality_grade, pesticide_used, organic_certified, blockchain_hash, qr_code_url, status

### Transaction
- transaction_id, batch_id, from_user_id, to_user_id, transaction_type
- location, temperature, humidity, blockchain_tx_hash, timestamp, notes

### QualityReport
- report_id, batch_id, inspector_id, inspection_date, pesticide_used
- organic_certified, grade, moisture_content, contamination, remarks, report_url

---

## 🔗 Blockchain Integration

The backend integrates with Ethereum blockchain via Ethers.js:

- **Smart Contract Interaction**: Add batches, transfer ownership, update status
- **Event Listening**: Real-time blockchain event monitoring
- **Verification**: Public batch verification without authentication
- **Dual Storage**: Critical data on blockchain, detailed data in PostgreSQL

**Note**: Blockchain features work in database-only mode if not configured.

---

## 📊 Logging

Logs are stored in `logs/` directory:

- `combined.log`: All logs
- `error.log`: Error logs only
- `exceptions.log`: Uncaught exceptions
- `rejections.log`: Unhandled promise rejections

Console logging in development mode, file logging in production.

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Test connection
psql -U postgres -d agri_supply_chain -c "SELECT 1;"
```

### Port Already in Use

```bash
# Find process on port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🚢 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=strong_random_secret_key
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name farmchain-api

# Monitor
pm2 monit

# Auto-restart on boot
pm2 startup
pm2 save
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Server port | No | 5000 |
| NODE_ENV | Environment | No | development |
| DB_HOST | Database host | Yes | localhost |
| DB_PORT | Database port | Yes | 5432 |
| DB_NAME | Database name | Yes | - |
| DB_USER | Database user | Yes | - |
| DB_PASSWORD | Database password | Yes | - |
| JWT_SECRET | JWT secret key | Yes | - |
| JWT_EXPIRE | Token expiry | No | 7d |
| BLOCKCHAIN_RPC_URL | Ethereum RPC URL | No | - |
| PRIVATE_KEY | Wallet private key | No | - |
| CONTRACT_ADDRESS | Smart contract address | No | - |
| FRONTEND_URL | Frontend URL (CORS) | No | http://localhost:3000 |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

FarmChain Development Team

---

## 📧 Support

For support, email support@farmchain.in or open an issue on GitHub.

---

## 🎯 Next Steps

1. ✅ Backend API setup complete
2. ✅ Database schema implemented
3. → Create API route controllers
4. → Deploy smart contracts
5. → Build frontend React app
6. → Integrate blockchain with backend
7. → Test end-to-end workflow
8. → Deploy to production

---

**Made with ❤️ for a transparent agricultural supply chain**
