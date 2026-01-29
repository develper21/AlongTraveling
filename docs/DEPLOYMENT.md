# Deployment Guide

This guide covers the deployment process for HopAcross, including automated deployments, manual deployments, and troubleshooting.

## 🚀 Automated Deployment

### GitHub Actions CI/CD

HopAlong uses GitHub Actions for automated deployment to production environments.

#### Triggers

- **Main branch**: Automatically deploys to production
- **Tags**: Creates releases and deploys to production
- **Manual**: Can be triggered manually from GitHub Actions tab

#### Deployment Pipeline

1. **Build and Test**
   - Runs backend tests with Jest
   - Runs frontend linting
   - Builds frontend for production
   - Performs security audit

2. **Deploy Backend**
   - Deploys to Render.com
   - Waits for deployment completion
   - Verifies backend health

3. **Deploy Frontend**
   - Deploys to Netlify
   - Verifies frontend health

4. **E2E Tests**
   - Runs Cypress tests against deployed applications
   - Uploads test results as artifacts

5. **Release Creation** (for tags)
   - Creates GitHub release
   - Generates changelog
   - Updates documentation

6. **Health Checks**
   - Verifies all services are healthy
   - Checks API documentation accessibility

## 🏗️ Manual Deployment

### Backend Deployment (Render.com)

#### Prerequisites

- Render.com account
- MongoDB database (MongoDB Atlas recommended)
- Environment variables configured

#### Steps

1. **Create Web Service**
   - Go to Render.com dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory as root directory

2. **Configure Service**
   ```yaml
   # render.yaml configuration
   services:
     - type: web
       name: alongtraveling-backend
       runtime: node
       plan: free
       env: node
       region: oregon
       buildCommand: "npm install --production"
       startCommand: "npm start"
       healthCheckPath: /health
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 5000
         - key: MONGODB_URI
           sync: false
         - key: JWT_SECRET
           sync: false
         - key: JWT_EXPIRE
           value: 30d
         - key: FRONTEND_URL
           value: https://alontraveling.netlify.app
         - key: EMAIL_HOST
           value: smtp.gmail.com
         - key: EMAIL_PORT
           value: 587
         - key: EMAIL_USER
           sync: false
         - key: EMAIL_PASSWORD
           sync: false
   ```

3. **Environment Variables**
   Set these in Render.com dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Strong secret key (minimum 32 characters)
   - `EMAIL_USER`: Your email for notifications
   - `EMAIL_PASSWORD`: Your email password or app password

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Verify health at `https://your-service-url.onrender.com/health`

### Frontend Deployment (Netlify)

#### Prerequisites

- Netlify account
- GitHub repository connected

#### Steps

1. **Create Site**
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select the `frontend` directory

2. **Build Settings**
   ```bash
   # Build command
   cd frontend && npm run build
   
   # Publish directory
   frontend/dist
   ```

3. **Environment Variables**
   Set these in Netlify dashboard:
   - `VITE_API_BASE_URL`: `https://your-backend-url.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://your-backend-url.onrender.com/`

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Verify site is accessible

## 🔧 Environment Configuration

### Backend Environment Variables

Create `.env` file in backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hopalong

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=30d

# Frontend Configuration
FRONTEND_URL=https://your-frontend-domain.netlify.app
FRONTEND_URLS=https://your-frontend-domain.netlify.app,https://www.your-frontend-domain.netlify.app

# Logging Configuration
LOG_LEVEL=info
```

### Frontend Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_BASE_URL=https://your-backend-domain.onrender.com/api
VITE_SOCKET_URL=https://your-backend-domain.onrender.com/
```

## 📊 Monitoring and Logging

### Backend Logging

The backend uses Winston for comprehensive logging:

- **Request Logging**: All HTTP requests are logged
- **Error Logging**: All errors are captured with stack traces
- **Security Events**: Rate limiting, authentication failures
- **Business Events**: User actions, trip operations

#### Log Files

- `logs/error.log`: Error-level logs
- `logs/combined.log`: All logs combined

#### Log Levels

- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages
- `debug`: Debug messages (development only)

### Health Checks

#### Backend Health Check

```bash
curl https://your-backend-domain.onrender.com/health
```

Response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-01-29T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

#### API Health Check

```bash
curl https://your-backend-domain.onrender.com/api/health
```

### API Documentation

Access Swagger documentation at:
```
https://your-backend-domain.onrender.com/api-docs
```

## 🔄 Database Management

### MongoDB Setup

#### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create a new cluster (M0 free tier is sufficient for development)
   - Configure network access (allow all IPs for development)

2. **Create Database User**
   - Create a database user with read/write permissions
   - Note the username and password

3. **Get Connection String**
   - Go to Cluster → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your user password

#### Local MongoDB

```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Create database
mongosh
use hopalong
```

### Database Seeding

```bash
cd backend
npm run seed
```

This creates sample data for testing:
- 6 demo users
- 10 sample trips
- Sample join requests and messages

## 🚨 Troubleshooting

### Common Issues

#### Backend Deployment Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :5000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Database Connection Failed**
   - Check MongoDB connection string
   - Verify network access
   - Check database user permissions

3. **Environment Variables Missing**
   - Verify all required environment variables are set
   - Check Render.com environment variables section

#### Frontend Deployment Issues

1. **Build Failed**
   - Check for syntax errors in code
   - Verify all dependencies are installed
   - Check environment variables

2. **API Connection Failed**
   - Verify `VITE_API_BASE_URL` is correct
   - Check CORS configuration on backend
   - Verify backend is deployed and healthy

#### E2E Test Failures

1. **Test Environment Issues**
   - Check Cypress configuration
   - Verify test URLs are correct
   - Check for timing issues

2. **Flaky Tests**
   - Add proper waits and assertions
   - Check for race conditions
   - Verify test data setup

### Debugging Commands

#### Backend Debugging

```bash
# Check logs
tail -f logs/combined.log

# Check error logs
tail -f logs/error.log

# Test API endpoints
curl -X GET https://your-backend-domain.onrender.com/api/health

# Test with authentication
curl -X GET https://your-backend-domain.onrender.com/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Frontend Debugging

```bash
# Build locally
cd frontend
npm run build

# Preview build
npm run preview

# Run E2E tests locally
npm run test:e2e:open
```

### Performance Monitoring

#### Backend Performance

Monitor these metrics:
- Response times
- Error rates
- Database query performance
- Memory usage

#### Frontend Performance

Monitor these metrics:
- Page load times
- Core Web Vitals
- JavaScript bundle size
- API response times

## 🔒 Security Considerations

### Backend Security

- JWT tokens are properly signed and validated
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- CORS is properly configured
- Security headers are set with Helmet

### Frontend Security

- Environment variables are properly configured
- API calls are properly authenticated
- User input is validated
- XSS protection is enabled

### Database Security

- Database access is restricted to authorized users
- Connection strings use secure authentication
- Sensitive data is properly encrypted
- Regular backups are configured

## 📈 Scaling Considerations

### Backend Scaling

- Use load balancers for high traffic
- Implement caching with Redis
- Use read replicas for database
- Monitor performance metrics

### Frontend Scaling

- Use CDN for static assets
- Implement lazy loading
- Optimize bundle sizes
- Use service workers for caching

## 🔄 Rollback Procedures

### Backend Rollback

1. **Quick Rollback**
   ```bash
   # Deploy previous version
   git checkout <previous-commit>
   git push origin main --force
   ```

2. **Database Rollback**
   ```bash
   # Restore from backup
   mongorestore --uri="mongodb://username:password@cluster.mongodb.net/hopalong" backup/
   ```

### Frontend Rollback

1. **Netlify Rollback**
   - Go to Netlify dashboard
   - Select "Deploys" tab
   - Click "Publish deploy" on previous version

2. **Manual Rollback**
   ```bash
   # Deploy previous version
   git checkout <previous-commit>
   git push origin main --force
   ```

## 📞 Support

For deployment issues:

1. **Check logs** for error messages
2. **Verify environment variables** are correctly set
3. **Test locally** to isolate issues
4. **Check GitHub Actions** for CI/CD failures
5. **Contact support** if issues persist

---

*Last updated: January 29, 2025*
