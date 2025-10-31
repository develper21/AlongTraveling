# 📋 Render Deployment Checklist

Use this checklist to ensure you complete all steps for successful deployment.

---

## ✅ Pre-Deployment (Do This First)

### 1. Code Preparation
- [x] `.env.example` file created
- [x] `package.json` has Node.js engine version
- [ ] `.gitignore` includes `.env` and `node_modules/`
- [ ] All dependencies in `package.json` are correct
- [ ] Code tested locally and working

### 2. MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Free cluster created (M0)
- [ ] Database user created with password saved
- [ ] Network access set to "Allow from Anywhere" (0.0.0.0/0)
- [ ] Connection string copied and password replaced
- [ ] Database name added to connection string

**Your MongoDB URI should look like:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hopalong?retryWrites=true&w=majority
```

### 3. GitHub Repository
- [ ] Git initialized in backend folder
- [ ] GitHub repository created
- [ ] Code pushed to GitHub main branch
- [ ] Repository is accessible (public or private with Render access)

---

## 🚀 Deployment Steps

### 4. Render Account Setup
- [ ] Render account created at [render.com](https://render.com)
- [ ] Signed up using GitHub (recommended)
- [ ] GitHub account connected to Render

### 5. Create Web Service
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Service name chosen (will be in URL)
- [ ] Region selected
- [ ] Runtime set to **Node**
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Instance type selected (Free or Starter)

### 6. Environment Variables Added
Add these in Render dashboard:

**Required:**
- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Random secret key (min 32 characters)
- [ ] `NODE_ENV` - Set to `production`

**Recommended:**
- [ ] `JWT_EXPIRE` - Set to `30d`
- [ ] `FRONTEND_URL` - Your frontend URL (can update later)

**Optional (if using email):**
- [ ] `EMAIL_HOST` - `smtp.gmail.com`
- [ ] `EMAIL_PORT` - `587`
- [ ] `EMAIL_USER` - Your Gmail
- [ ] `EMAIL_PASSWORD` - Gmail App Password

**Important:** Do NOT add `PORT` - Render provides this automatically!

### 7. Deploy
- [ ] Clicked "Create Web Service"
- [ ] Deployment started
- [ ] Watched logs for errors
- [ ] Deployment succeeded (green checkmark)

---

## ✅ Post-Deployment Verification

### 8. Test Your Backend
- [ ] Backend URL accessible: `https://your-service.onrender.com`
- [ ] Root endpoint works: `https://your-service.onrender.com/`
- [ ] Health check works: `https://your-service.onrender.com/api/health`
- [ ] No errors in Render logs
- [ ] MongoDB connection successful (check logs)

### 9. Test API Endpoints
Test with Postman or curl:

**Health Check:**
```bash
curl https://your-service.onrender.com/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-10-31T..."
}
```

**Root Endpoint:**
```bash
curl https://your-service.onrender.com/
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Welcome to HopAlong API",
  "version": "1.0.0",
  "endpoints": {...}
}
```

### 10. Update Frontend
- [ ] Updated frontend to use new backend URL
- [ ] Tested frontend-backend connection
- [ ] CORS working correctly
- [ ] Socket.IO connections working

---

## 📝 Important Information to Save

### Your Backend URL:
```
https://your-service-name.onrender.com
```

### Your MongoDB Connection:
```
mongodb+srv://username:password@cluster.mongodb.net/hopalong
```

### Your JWT Secret:
```
(Keep this secret and secure!)
```

---

## 🔄 After Making Changes

When you update your code:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

2. **Render auto-deploys** - No manual action needed!

3. **Check deployment status** in Render dashboard

---

## 🐛 Troubleshooting

If deployment fails, check:

- [ ] All environment variables are set correctly
- [ ] MongoDB URI is correct and password is replaced
- [ ] MongoDB Atlas allows connections from anywhere
- [ ] No syntax errors in code
- [ ] All dependencies are installed
- [ ] Render logs for specific error messages

**Common Issues:**
- MongoDB connection timeout → Check network access in Atlas
- Module not found → Check package.json dependencies
- Port errors → Remove PORT from environment variables
- CORS errors → Update FRONTEND_URL

---

## 💡 Tips for Success

1. **Free Tier Sleep:** Render free tier sleeps after 15 min inactivity
   - First request after sleep takes 30-60 seconds
   - Consider upgrading to Starter ($7/month) for always-on

2. **Monitor Logs:** Always check logs after deployment
   - Dashboard → Your Service → Logs

3. **Environment Variables:** Can be updated anytime
   - Changes trigger automatic redeployment

4. **Custom Domain:** Can add later in Render settings

5. **Database Backups:** MongoDB Atlas auto-backs up on free tier

---

## 🎉 Deployment Complete!

Once all checkboxes are marked:
- ✅ Your backend is live and accessible
- ✅ MongoDB is connected
- ✅ API endpoints are working
- ✅ Ready to connect with frontend

**Next Steps:**
1. Share backend URL with frontend team
2. Test all features end-to-end
3. Monitor performance and logs
4. Consider upgrading if needed

---

**Need help?** Check `RENDER_DEPLOYMENT_GUIDE.md` for detailed instructions!
