# 🔐 Google Sign-In Complete Process Guide

## 📋 Overview

FaltuVerse uses **Google OAuth 2.0** for user authentication. Ye guide complete process explain karega step-by-step.

---

## 🏗️ Architecture Flow

```
User → Frontend (React) → Google OAuth → Backend (Node.js) → Database (MySQL)
```

---

## 📝 Step-by-Step Process

### **Step 1: Google Cloud Console Setup**

1. **Google Cloud Console mein jao:**
   - https://console.cloud.google.com/
   - Project create karo ya existing project select karo

2. **OAuth Consent Screen Setup:**
   - APIs & Services → OAuth consent screen
   - User Type: External (public)
   - App name: FaltuVerse
   - Support email: apna email
   - Scopes: `email`, `profile`, `openid`
   - Save karo

3. **OAuth 2.0 Credentials Create:**
   - APIs & Services → Credentials
   - "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: FaltuVerse Web Client
   - **Authorized JavaScript origins:**
     - `http://localhost:5173` (development)
     - `http://localhost:3000` (if using different port)
     - Production URL (jab deploy karo)
   - **Authorized redirect URIs:**
     - `http://localhost:5173` (development)
     - Production URL (jab deploy karo)
   - Create karo
   - **Client ID** aur **Client Secret** copy karo

4. **Credentials ko env.sh mein add karo:**
   ```bash
   export GOOGLE_CLIENT_ID=your_client_id_here
   export GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

---

### **Step 2: Frontend Setup (React)**

#### **2.1 Package Installation**

Frontend mein Google OAuth library install karo:
```bash
cd frontend
npm install @react-oauth/google
```

#### **2.2 Google OAuth Provider Setup**

`frontend/src/main.jsx` ya `frontend/src/App.jsx` mein:

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* Your app components */}
    </GoogleOAuthProvider>
  )
}
```

#### **2.3 Environment Variable**

`frontend/.env` file mein:
```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_API_URL=http://localhost:5000/api
```

#### **2.4 Login Button Implementation**

`frontend/src/pages/Login.jsx` mein:

```jsx
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  
  return (
    <button onClick={login}>
      Sign in with Google
    </button>
  )
}
```

---

### **Step 3: Backend Setup (Node.js)**

#### **3.1 Package Installation**

Backend mein Google Auth library install karo:
```bash
cd backend
npm install google-auth-library
```

#### **3.2 Environment Variables**

`backend/.env` ya `env.sh` mein:
```bash
export GOOGLE_CLIENT_ID=your_client_id_here
export GOOGLE_CLIENT_SECRET=your_client_secret_here
export GOOGLE_REDIRECT_URI=http://localhost:5173
```

#### **3.3 OAuth2Client Setup**

`backend/src/services/authService.js`:
```javascript
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
```

---

## 🔄 Complete Authentication Flow

### **Flow Diagram:**

```
┌─────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│  User   │────────▶│ Frontend │────────▶│ Google  │────────▶│ Backend  │
│         │         │  (React) │         │  OAuth  │         │ (Node.js)│
└─────────┘         └──────────┘         └─────────┘         └──────────┘
     │                    │                      │                    │
     │                    │                      │                    │
     │  1. Click Login    │                      │                    │
     │◀───────────────────│                      │                    │
     │                    │                      │                    │
     │  2. Redirect to   │                      │                    │
     │     Google         │                      │                    │
     │───────────────────▶│─────────────────────▶│                    │
     │                    │                      │                    │
     │  3. User approves │                      │                    │
     │◀───────────────────│◀─────────────────────│                    │
     │                    │                      │                    │
     │  4. Google returns│                      │                    │
     │     access_token   │                      │                    │
     │───────────────────▶│                      │                    │
     │                    │                      │                    │
     │  5. Send token to │                      │                    │
     │     backend        │                      │                    │
     │                    │─────────────────────▶│                    │
     │                    │                      │                    │
     │  6. Verify token   │                      │                    │
     │     & get user info│                      │                    │
     │                    │                      │                    │
     │  7. Create/Find    │                      │                    │
     │     user in DB     │                      │                    │
     │                    │                      │                    │
     │  8. Generate JWT  │                      │                    │
     │     token          │                      │                    │
     │                    │◀─────────────────────│                    │
     │                    │                      │                    │
     │  9. Store token &  │                      │                    │
     │     redirect       │                      │                    │
     │◀───────────────────│                      │                    │
```

---

## 📱 Detailed Step-by-Step Flow

### **Step 1: User Clicks Login**

**Frontend (`Login.jsx`):**
```jsx
<FloatingButton onClick={login}>
  LOGIN KARLE YA SOJA
</FloatingButton>
```

**AuthContext (`AuthContext.jsx`):**
```javascript
const login = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    // Token mil gaya!
  },
  onError: () => {
    // Error aaya
  }
})
```

---

### **Step 2: Google OAuth Popup Opens**

- User ko Google login page dikhega
- User apna Google account se login karega
- Permissions approve karega (email, profile)

---

### **Step 3: Google Returns Access Token**

**Google se response:**
```json
{
  "access_token": "ya29.a0AfH6SMC...",
  "expires_in": 3599,
  "scope": "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  "token_type": "Bearer"
}
```

---

### **Step 4: Frontend Sends Token to Backend**

**AuthContext (`AuthContext.jsx`):**
```javascript
// Get user info from Google
const googleUserResponse = await fetch(
  'https://www.googleapis.com/oauth2/v3/userinfo',
  {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`
    }
  }
)
const googleUser = await googleUserResponse.json()

// Send to backend
const response = await api.post('/auth/google', {
  token: tokenResponse.access_token
})
```

---

### **Step 5: Backend Verifies Token**

**Backend (`authService.js`):**
```javascript
const verifyGoogleToken = async (token) => {
  try {
    // Try ID token verification first
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      profilePhoto: payload.picture
    }
  } catch (idTokenError) {
    // Fallback: Use access token to fetch user info
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    return {
      googleId: userInfoResponse.data.sub,
      email: userInfoResponse.data.email,
      name: userInfoResponse.data.name,
      profilePhoto: userInfoResponse.data.picture
    }
  }
}
```

---

### **Step 6: Backend Creates/Updates User**

**Backend (`authService.js`):**
```javascript
const findOrCreateUser = async (googleUserData) => {
  // Check if user exists with Google ID
  let user = await User.findOne({ 
    where: { google_id: googleUserData.googleId } 
  })

  if (!user) {
    // Check if user exists with email
    user = await User.findOne({ 
      where: { email: googleUserData.email } 
    })
    
    if (user) {
      // Update existing user with Google ID
      user.google_id = googleUserData.googleId
      user.profile_photo = googleUserData.profilePhoto
      await user.save()
    } else {
      // Create new user
      user = await User.create({
        name: googleUserData.name,
        email: googleUserData.email,
        profile_photo: googleUserData.profilePhoto,
        google_id: googleUserData.googleId
      })

      // Initialize user points
      await UserPoints.create({
        user_id: user.user_id,
        total_points: 0,
        login_streak: 0
      })
    }
  }

  return user
}
```

---

### **Step 7: Backend Generates JWT Token**

**Backend (`authService.js`):**
```javascript
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}
```

---

### **Step 8: Backend Returns Response**

**Backend (`authController.js`):**
```javascript
res.json({
  token: jwtToken,
  user: {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    profile_photo: user.profile_photo
  },
  login_streak: streak,
  welcome_message: welcomeMessage // AI-generated
})
```

---

### **Step 9: Frontend Stores Token & Redirects**

**AuthContext (`AuthContext.jsx`):**
```javascript
const { token: jwtToken, user: userData } = response.data

// Store in state
setToken(jwtToken)
setUser(userData)

// Store in localStorage
localStorage.setItem('token', jwtToken)

// Set axios default header
api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`

// Redirect to dashboard
navigate('/dashboard')
```

---

## 🔧 Configuration Checklist

### **Google Cloud Console:**
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized JavaScript origins added
- [ ] Authorized redirect URIs added
- [ ] Client ID copied
- [ ] Client Secret copied

### **Backend:**
- [ ] `google-auth-library` installed
- [ ] `GOOGLE_CLIENT_ID` set in env.sh
- [ ] `GOOGLE_CLIENT_SECRET` set in env.sh
- [ ] `GOOGLE_REDIRECT_URI` set in env.sh
- [ ] OAuth2Client initialized
- [ ] `/api/auth/google` route working

### **Frontend:**
- [ ] `@react-oauth/google` installed
- [ ] `GoogleOAuthProvider` wrapping app
- [ ] `VITE_GOOGLE_CLIENT_ID` set in .env
- [ ] Login button implemented
- [ ] AuthContext configured

---

## 🐛 Common Issues & Solutions

### **Issue 1: "redirect_uri_mismatch"**
**Solution:**
- Google Cloud Console mein redirect URI check karo
- Frontend URL match karna chahiye
- `http://localhost:5173` vs `http://localhost:3000` - dono add karo

### **Issue 2: "invalid_client"**
**Solution:**
- Client ID aur Secret check karo
- Environment variables properly set hain ya nahi
- `env.sh` source kiya hai ya nahi

### **Issue 3: "access_denied"**
**Solution:**
- OAuth consent screen properly configured hai ya nahi
- Scopes properly set hain (`email`, `profile`, `openid`)

### **Issue 4: Token verification fails**
**Solution:**
- Backend mein `GOOGLE_CLIENT_ID` sahi hai ya nahi
- Token properly pass ho raha hai ya nahi
- Network requests check karo

---

## 📊 Current Implementation Status

### **✅ Already Implemented:**
1. Backend OAuth2Client setup
2. Token verification (`verifyGoogleToken`)
3. User creation/update (`findOrCreateUser`)
4. JWT token generation
5. Login streak tracking
6. Points system integration
7. AI welcome message generation
8. Frontend Google OAuth hook
9. AuthContext integration
10. Login page button

### **⚠️ Needs Configuration:**
1. Google Cloud Console setup (user ko karna hoga)
2. Environment variables set karni hain
3. Frontend `.env` file create karni hai
4. Testing karni hai

---

## 🚀 Quick Start

1. **Google Cloud Console setup karo** (upar diya hua)
2. **Credentials copy karo**
3. **env.sh mein add karo:**
   ```bash
   export GOOGLE_CLIENT_ID=your_client_id
   export GOOGLE_CLIENT_SECRET=your_client_secret
   ```
4. **Frontend .env mein add karo:**
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id
   ```
5. **Servers restart karo:**
   ```bash
   ./start.sh
   ```
6. **Test karo:**
   - Login page par jao
   - "LOGIN KARLE YA SOJA" button click karo
   - Google login popup aayega
   - Login karo
   - Dashboard redirect hoga!

---

## 📝 Notes

- **Development:** `http://localhost:5173` use karo
- **Production:** Apni domain URL add karo Google Console mein
- **Security:** Client Secret kabhi bhi frontend mein expose mat karo
- **Testing:** Admin login bhi available hai testing ke liye

---

## 🎯 Summary

Google Sign-In ka process:
1. User clicks login → Google OAuth popup opens
2. User approves → Google returns access_token
3. Frontend sends token to backend → Backend verifies
4. Backend creates/updates user → Generates JWT
5. Frontend stores token → Redirects to dashboard

**Sab kuch already implemented hai! Bas Google Console setup karna hai aur credentials add karni hain!** 🎉

