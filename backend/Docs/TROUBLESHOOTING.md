# 🔧 Troubleshooting Guide - Render Deployment

## Common Issues and Solutions for HopAlong Backend

---

## 🔴 Issue 1: "Application failed to respond"

### Symptoms:
- Render shows "Application failed to respond"
- Service status is "Deploy failed"

### Solutions:

**A. Check MongoDB Connection**
```
Error in logs: "MongooseServerSelectionError: Could not connect to any servers"
```

**Fix:**
1. Go to MongoDB Atlas → Network Access
2. Make sure `0.0.0.0/0` is in allowed IPs
3. Verify connection string in Render environment variables
4. Check password has no special characters that need encoding

**B. Check Environment Variables**
1. Render Dashboard → Your Service → Environment
2. Verify `MONGODB_URI` is correct
3. Verify `JWT_SECRET` is set
4. Verify `NODE_ENV` is `production`

**C. Check Logs**
1. Render Dashboard → Your Service → Logs
2. Look for specific error messages
3. Common errors:
   - Missing environment variables
   - MongoDB connection timeout
   - Module not found

---

## 🔴 Issue 2: "Module not found" Error

### Symptoms:
```
Error: Cannot find module 'express'
Error: Cannot find module 'mongoose'
```

### Solutions:

**A. Check package.json**
Make sure all dependencies are in `dependencies`, not `devDependencies`:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    // ... all other packages
  },
  "devDependencies": {
    "nodemon": "^3.0.1"  // Only dev tools here
  }
}
```

**B. Clear Build Cache**
1. Render Dashboard → Your Service → Settings
2. Scroll to "Build & Deploy"
3. Click "Clear build cache & deploy"

**C. Verify Build Command**
- Build Command should be: `npm install`
- Start Command should be: `npm start`

---

## 🔴 Issue 3: MongoDB Connection Timeout

### Symptoms:
```
MongooseServerSelectionError: connect ETIMEDOUT
```

### Solutions:

**A. Whitelist All IPs**
1. MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere"
4. IP: `0.0.0.0/0`
5. Click "Confirm"

**B. Check Connection String Format**
Should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hopalong?retryWrites=true&w=majority
```

**C. Encode Special Characters in Password**
If password has special characters like `@`, `#`, `%`:
- Use URL encoding: `@` → `%40`, `#` → `%23`
- Or create new password without special characters

---

## 🔴 Issue 4: CORS Errors from Frontend

### Symptoms:
```
Access to fetch at 'https://backend.onrender.com/api/...' from origin 'https://frontend.vercel.app' 
has been blocked by CORS policy
```

### Solutions:

**A. Update FRONTEND_URL**
1. Render Dashboard → Your Service → Environment
2. Update `FRONTEND_URL` to your actual frontend URL
3. Example: `https://your-app.vercel.app`
4. Click "Save Changes" (auto-redeploys)

**B. Check server.js CORS Configuration**
Your code already handles this correctly:
```javascript
const ALLOWED_ORIGINS = [DEFAULT_ORIGIN, 'http://localhost:3001'];
```

**C. For Multiple Frontend URLs**
Update `server.js` line 37:
```javascript
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
  'https://your-production-frontend.vercel.app',
  'https://your-staging-frontend.vercel.app'
];
```

---

## 🔴 Issue 5: Socket.IO Not Connecting

### Symptoms:
- Real-time features not working
- Chat messages not appearing
- Notifications not received

### Solutions:

**A. Free Tier Sleep Issue**
Render free tier sleeps after 15 minutes of inactivity.

**Fix:**
- Upgrade to Starter plan ($7/month) for always-on
- Or use [UptimeRobot](https://uptimerobot.com/) to ping every 5 minutes

**B. Check Socket.IO CORS**
Already configured in your `server.js`:
```javascript
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true
  }
});
```

**C. Frontend Connection**
Make sure frontend connects to correct URL:
```javascript
const socket = io('https://your-backend.onrender.com', {
  transports: ['websocket', 'polling']
});
```

---

## 🔴 Issue 6: "Port already in use"

### Symptoms:
```
Error: listen EADDRINUSE: address already in use :::5000
```

### Solutions:

**A. Remove PORT from Environment Variables**
1. Render Dashboard → Environment
2. If you see `PORT` variable, DELETE it
3. Render provides `PORT` automatically
4. Your code handles it: `process.env.PORT || 5000`

**B. Verify Start Command**
- Should be: `npm start`
- NOT: `PORT=5000 npm start`

---

## 🔴 Issue 7: JWT Authentication Failing

### Symptoms:
- Login returns 401 Unauthorized
- Token validation fails
- "Invalid token" errors

### Solutions:

**A. Check JWT_SECRET**
1. Render Dashboard → Environment
2. Verify `JWT_SECRET` is set
3. Should be long random string (min 32 characters)

**B. Check JWT_EXPIRE**
- Should be: `30d` or similar
- Not: `30` (needs unit: d, h, m)

**C. Verify Token in Frontend**
Make sure frontend sends token correctly:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 🔴 Issue 8: Slow Response Times

### Symptoms:
- First request takes 30-60 seconds
- Subsequent requests are fast
- Happens after period of inactivity

### Cause:
Render free tier sleeps after 15 minutes of no traffic.

### Solutions:

**A. Upgrade to Paid Plan**
- Starter plan ($7/month) keeps service always-on
- No sleep, no cold starts

**B. Keep Service Awake (Free Tier)**
Use [UptimeRobot](https://uptimerobot.com/):
1. Create free account
2. Add monitor → HTTP(s)
3. URL: `https://your-backend.onrender.com/api/health`
4. Interval: 5 minutes
5. Pings keep service awake

**C. Optimize Cold Start**
Already optimized in your code - no changes needed.

---

## 🔴 Issue 9: Email Not Sending

### Symptoms:
- Email verification not working
- Password reset emails not received

### Solutions:

**A. Gmail App Password**
If using Gmail:
1. Enable 2-Step Verification
2. Generate App Password (not regular password)
3. Use App Password in `EMAIL_PASSWORD`

**B. Check Email Variables**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**C. Check Logs**
Look for email-related errors in Render logs.

---

## 🔴 Issue 10: Database Data Not Persisting

### Symptoms:
- Data disappears after restart
- Can't find saved records

### Solutions:

**A. Verify MongoDB Connection**
Check logs for:
```
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

**B. Check Database Name**
Connection string should include database name:
```
mongodb+srv://user:pass@cluster.mongodb.net/hopalong?retryWrites=true
                                                      ^^^^^^^^
```

**C. Verify in MongoDB Atlas**
1. MongoDB Atlas → Database → Browse Collections
2. Check if data is actually saved
3. Verify database name matches

---

## 📊 How to Check Logs

### Render Logs:
1. Render Dashboard
2. Click your service
3. Click "Logs" tab
4. Filter by time period
5. Look for errors in red

### MongoDB Logs:
1. MongoDB Atlas
2. Click your cluster
3. Metrics tab
4. Check connection count and operations

---

## 🆘 Still Having Issues?

### 1. Check Full Logs
```bash
# In Render dashboard, download full logs
# Look for the first error that appears
```

### 2. Test Locally First
```bash
cd /home/narvin/Documents/FullStack/AlongTraveling/backend

# Set environment variables in .env
MONGODB_URI=your_connection_string
JWT_SECRET=test_secret
NODE_ENV=development

# Run locally
npm install
npm start

# Test at http://localhost:5000
```

### 3. Compare Environments
- If works locally but not on Render → Environment variable issue
- If doesn't work locally → Code issue

### 4. Resources
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

---

## ✅ Prevention Checklist

Before deploying, verify:
- [ ] All environment variables set correctly
- [ ] MongoDB Atlas network access configured
- [ ] Code works locally
- [ ] All dependencies in package.json
- [ ] .gitignore includes .env
- [ ] Node version specified in package.json

---

**Remember:** Most issues are related to environment variables or MongoDB connection. Always check these first!
