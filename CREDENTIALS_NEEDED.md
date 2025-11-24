# 🔑 Required Credentials for FaltuVerse

## 📋 Complete List of Required Values

Aapko yeh sab values provide karni hongi `env.sh` file mein:

### 1️⃣ **MySQL Database** (Required)
```
DB_PASSWORD=your_mysql_root_password
```
- MySQL root password
- Ya jo bhi MySQL user password hai

### 2️⃣ **JWT Secret** (Required)
```
JWT_SECRET=any_random_long_string_here
```
- Koi bhi random long string (minimum 32 characters)
- Example: `my_super_secret_jwt_key_12345_never_share_this`

### 3️⃣ **Google OAuth** (Required)
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_GOOGLE_CLIENT_ID=your_google_client_id  (same as above)
```

**Kaise milega:**
1. Go to: https://console.cloud.google.com/
2. Create new project ya select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: Web application
6. Authorized JavaScript origins: `http://localhost:5173`
7. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
8. Copy Client ID aur Client Secret

### 4️⃣ **OpenAI API Key** (Optional - AI features ke liye)
```
OPENAI_API_KEY=sk-your_openai_api_key_here
```

**Kaise milega:**
1. Go to: https://platform.openai.com/api-keys
2. Create new API key
3. Copy the key (starts with `sk-`)

**Note:** Agar yeh nahi diya toh bhi app chalega, bas AI features disabled rahenge.

---

## 🚀 Quick Setup Steps

### Step 1: Edit `env.sh` file
```bash
nano env.sh
# Ya koi bhi editor use karo
```

### Step 2: Replace these values:
- `YOUR_MYSQL_PASSWORD_HERE` → Your MySQL password
- `YOUR_SUPER_SECRET_JWT_KEY_CHANGE_THIS_IN_PRODUCTION` → Random secret key
- `YOUR_GOOGLE_CLIENT_ID_HERE` → Google Client ID (2 jagah)
- `YOUR_GOOGLE_CLIENT_SECRET_HERE` → Google Client Secret
- `YOUR_OPENAI_API_KEY_HERE` → OpenAI API Key (optional)

### Step 3: Source the file
```bash
source env.sh
```

### Step 4: Generate .env files
```bash
generate_env_files
```

### Step 5: Check if everything is set
```bash
check_env
```

### Step 6: Start servers
```bash
# Terminal 1 - Backend
cd backend
npm install  # pehli baar
npm start

# Terminal 2 - Frontend  
cd frontend
npm install  # pehli baar
npm run dev
```

---

## 📝 Example `env.sh` (After filling values)

```bash
#!/bin/bash

# Database
export DB_PASSWORD=mypassword123

# JWT
export JWT_SECRET=my_super_secret_key_12345_abcdefghijklmnop

# Google OAuth
export GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
export GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
export VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com

# OpenAI (Optional)
export OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz1234567890
```

---

## ✅ Checklist

Before starting servers, make sure:

- [ ] MySQL database `faltuverse` created
- [ ] MySQL server running
- [ ] All credentials filled in `env.sh`
- [ ] `source env.sh` command run
- [ ] `generate_env_files` command run
- [ ] `check_env` shows all ✅
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Database migrations run (`cd backend && npm run migrate`)

---

## 🆘 Troubleshooting

### MySQL Connection Error
- Check MySQL is running: `mysql.server start` (Mac) or `sudo systemctl start mysql` (Linux)
- Verify password in `env.sh`
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Google OAuth Not Working
- Verify Client ID matches in both backend and frontend
- Check authorized origins in Google Console
- Ensure Google+ API is enabled

### Port Already in Use
- Change `PORT=5000` to different port in `env.sh`
- Update `VITE_API_URL` accordingly

---

## 📞 Need Help?

Agar koi value nahi mil rahi ya issue ho raha hai, batana!

