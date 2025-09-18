# Backend Deployment Guide

## Deploy to Render.com

1. **Create Render Account**: Go to [render.com](https://render.com) and sign up

2. **Connect GitHub**: Connect your GitHub repository

3. **Create Web Service**:
   - Choose "Web Service"
   - Connect your repository
   - Set root directory to `backend`
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `gunicorn app:app`

4. **Environment Variables**:
   ```
   SECRET_KEY=prod-secret-key-edgecraft-glass-2025
   JWT_SECRET_KEY=prod-jwt-secret-edgecraft-glass-2025
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   MONGODB_DB_NAME=edgecraft_glass_prod
   FLASK_ENV=production
   PORT=10000
   ```

5. **MongoDB Setup**:
   - Create MongoDB Atlas account
   - Create cluster and database
   - Get connection string
   - Update MONGODB_URI in environment variables

## Deploy to Heroku

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create App**: `heroku create edgecraft-glass-api`
4. **Set Environment Variables**:
   ```bash
   heroku config:set SECRET_KEY=prod-secret-key-edgecraft-glass-2025
   heroku config:set JWT_SECRET_KEY=prod-jwt-secret-edgecraft-glass-2025
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   heroku config:set MONGODB_DB_NAME=edgecraft_glass_prod
   heroku config:set FLASK_ENV=production
   ```
5. **Deploy**: 
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a edgecraft-glass-api
   git push heroku main
   ```

## Deploy to Railway

1. **Create Railway Account**: Go to [railway.app](https://railway.app)
2. **Connect GitHub Repository**
3. **Set Root Directory**: `backend`
4. **Environment Variables**: Same as above
5. **Deploy**: Railway will auto-deploy

## Deploy to Vercel (Serverless)

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Create vercel.json** in backend folder:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "app.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "app.py"
       }
     ]
   }
   ```
3. **Deploy**: `vercel --prod`

## Update Frontend API URL

After deploying backend, update the API URL in frontend:

1. Update `.env` file:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

2. Redeploy frontend to Bolt Hosting

## Testing Deployed API

Test your deployed API:
```bash
curl https://your-backend-url.com/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000000",
  "database": "connected"
}
```