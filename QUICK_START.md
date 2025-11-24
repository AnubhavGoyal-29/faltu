# 🚀 Quick Start Guide

## ✅ Setup Complete!

Sab kuch ready hai. Ab sirf MySQL start karna hai aur server start kar sakte ho.

## 📋 Current Status

- ✅ Environment variables set (placeholder values)
- ✅ .env files generated
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ⚠️  MySQL server needs to be started

## 🔧 Next Steps

### 1. Start MySQL Server

**Mac:**
```bash
brew services start mysql
# Ya
mysql.server start
```

**Linux:**
```bash
sudo systemctl start mysql
# Ya
sudo service mysql start
```

**Verify MySQL is running:**
```bash
mysql -u root -proot123 -e "SELECT 1;" 2>&1 | grep -v "Warning"
```

### 2. Create Database (if not exists)

```bash
mysql -u root -proot123 -e "CREATE DATABASE IF NOT EXISTS faltuverse;"
```

**Note:** Agar MySQL password different hai, toh `env.sh` mein `DB_PASSWORD` update karo.

### 3. Run Database Migrations

```bash
cd backend
npm run migrate
```

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd /Users/crafto/faltu/backend
source ../env.sh
npm start
```

**Terminal 2 - Frontend:**
```bash
cd /Users/crafto/faltu/frontend
source ../env.sh
npm run dev
```

### 5. Access the App

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## ⚠️ Important Notes

### Current Placeholder Values

Agar real values chahiye toh `env.sh` file mein update karo:

1. **MySQL Password:** `DB_PASSWORD=root123` (change if different)
2. **Google OAuth:** Currently placeholder values - Google login kaam nahi karega
3. **JWT Secret:** Currently set to a random value - production mein change karna hoga

### Google OAuth Setup (Optional - for login to work)

1. Go to: https://console.cloud.google.com/
2. Create OAuth 2.0 Client ID
3. Update `env.sh`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `VITE_GOOGLE_CLIENT_ID`

### OpenAI API (Optional - for AI features)

Agar AI features chahiye:
1. Get API key from: https://platform.openai.com/api-keys
2. Update `env.sh`: `OPENAI_API_KEY=sk-...`

---

## 🐛 Troubleshooting

### MySQL Connection Error
```bash
# Check MySQL is running
mysql.server status

# Start MySQL
mysql.server start

# Check password
mysql -u root -p
```

### Port Already in Use
```bash
# Change port in env.sh
export PORT=5001  # Backend
export VITE_API_URL=http://localhost:5001  # Frontend
```

### Google Login Not Working
- Check Google OAuth credentials in `env.sh`
- Verify authorized origins in Google Console
- Ensure Google+ API is enabled

---

## 🎉 Ready to Go!

Sab set hai! MySQL start karo aur servers start kar do! 🚀

