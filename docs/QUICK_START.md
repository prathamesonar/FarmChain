# 🚀 FarmChain Quick Start Guide

Get your FarmChain backend up and running in 5 minutes!

---

## Prerequisites Check

Before starting, make sure you have:

- [ ] **Node.js** v18+ installed (`node --version`)
- [ ] **npm** v9+ installed (`npm --version`)
- [ ] **PostgreSQL** v14+ installed (`psql --version`)
- [ ] **Git** installed (`git --version`)

---

## Step 1: Install Dependencies (1 min)

```bash
cd FarmChain/backend
npm install
```

**Expected output**: All dependencies installed successfully (20-30 packages)

---

## Step 2: Set Up PostgreSQL Database (2 min)

### Option A: Automated Setup (Recommended)

```bash
cd database
./setup.sh
```

Follow the prompts:
1. Confirm database creation
2. Choose to load seed data (Y)
3. Done! ✅

### Option B: Manual Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE agri_supply_chain;"

# Run schema
psql -U postgres -d agri_supply_chain -f database/schema.sql

# Load seed data
psql -U postgres -d agri_supply_chain -f database/seeds.sql
```

---

## Step 3: Configure Environment (1 min)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # or use your favorite editor
```

**Minimum required configuration:**

```env
PORT=5000
NODE_ENV=development

# Database (update password!)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agri_supply_chain
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_key_at_least_32_characters_long

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Save and exit** (Ctrl+X, then Y, then Enter)

---

## Step 4: Start the Server (1 min)

```bash
npm run dev
```

**Expected output:**

```
✅ Database connection established successfully
🚀 Server running on port 5000 in development mode
📡 API available at http://localhost:5000/api
🏥 Health check at http://localhost:5000/health
```

---

## Step 5: Test the API (30 seconds)

### Test Health Endpoint

```bash
curl http://localhost:5000/health
```

**Expected response:**

```json
{
  "status": "success",
  "message": "FarmChain API is running",
  "timestamp": "2025-11-08T...",
  "environment": "development"
}
```

### Test Login with Seed Data

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ramesh@farm.in",
    "password": "password123"
  }'
```

**Expected response:**

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "userId": 1,
      "name": "Ramesh Patil",
      "email": "ramesh@farm.in",
      "role": "farmer"
    }
  }
}
```

---

## ✅ Success!

Your FarmChain backend is now running! 🎉

---

## What's Next?

### Test All Features

Use the test credentials from seed data:

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

### Test More Endpoints

**Get All Batches:**
```bash
# First, login and copy the token
TOKEN="your_jwt_token_here"

# Then get batches
curl -X GET http://localhost:5000/api/batches \
  -H "Authorization: Bearer $TOKEN"
```

**Create a New Batch (Farmer):**
```bash
curl -X POST http://localhost:5000/api/batches \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cropType": "Tomato",
    "quantity": 500,
    "unit": "kg",
    "harvestDate": "2025-11-08",
    "qualityGrade": "A+",
    "organicCertified": true
  }'
```

---

## 🛠️ Troubleshooting

### Issue: Database Connection Failed

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Test connection
psql -U postgres -c "SELECT 1;"
```

### Issue: Port 5000 Already in Use

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env file
```

### Issue: JWT Secret Error

**Solution:**
- Make sure `JWT_SECRET` in `.env` is set
- Must be at least 32 characters long
- No spaces or special characters

### Issue: Module Not Found

**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- **Backend API**: `/backend/README.md`
- **Database**: `/backend/database/README.md`
- **Progress**: `/docs/PROGRESS.md`

---

## 🔍 Useful Commands

```bash
# Start server (development)
npm run dev

# Start server (production)
npm start

# Check logs
tail -f logs/combined.log

# Test database connection
psql -U postgres -d agri_supply_chain -c "SELECT COUNT(*) FROM users;"

# View all batches in database
psql -U postgres -d agri_supply_chain -c "SELECT * FROM batch_details_view;"

# Clear logs
rm -rf logs/*.log
```

---

## 🐛 Debug Mode

Enable detailed logging:

```env
# In .env file
NODE_ENV=development
LOG_LEVEL=debug
```

---

## 🎯 Development Tips

1. **Auto-restart**: Server automatically restarts on file changes (nodemon)
2. **Logs**: Check `logs/combined.log` for detailed logs
3. **Database**: Use `psql` or pgAdmin to inspect data
4. **API Testing**: Use Postman, Insomnia, or Thunder Client
5. **JWT Token**: Copy from login response for authenticated requests

---

## 📞 Need Help?

- Check `/backend/README.md` for detailed documentation
- Review `/docs/PROGRESS.md` for project status
- Check logs in `/backend/logs/`
- Open an issue on GitHub

---

## ✨ You're Ready!

Your backend is now:
- ✅ Running on http://localhost:5000
- ✅ Connected to PostgreSQL
- ✅ Loaded with test data
- ✅ Secured with JWT
- ✅ Logging all operations

**Time to build those API routes and connect the frontend!** 🚀

---

**Pro Tip**: Keep the terminal open to see real-time logs while developing!
