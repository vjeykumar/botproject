# Edgecraft Glass Platform

A premium glass ordering platform with custom dimensions and professional quality products.

## Quick Start

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev:full
```

### Option 2: Run Services Separately

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
cd backend
python app.py
```

## Setup Instructions

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (backend/.env):**
```
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=edgecraft_glass
FLASK_ENV=development
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB: `mongod`
3. MongoDB will be available at `mongodb://localhost:27017/`

**Option B: MongoDB Compass**
1. Install MongoDB Compass
2. Connect to `mongodb://localhost:27017/`
3. Create database: `edgecraft_glass`

**Option C: MongoDB Atlas**
1. Create MongoDB Atlas account
2. Create cluster and get connection string
3. Update `MONGODB_URI` in backend/.env

## Services

- **Frontend**: React + TypeScript + Tailwind CSS (Port 5173)
- **Backend**: Flask + MongoDB + JWT Auth (Port 5000)
- **Database**: MongoDB with Compass integration

## Features

- **Authentication**: JWT-based login/register
- **Product Catalog**: Glass products with custom dimensions
- **Gift Collection**: Curated gift items with special packaging
- **Shopping Cart**: Add/remove items with customization
- **Payment Processing**: Multiple payment methods
- **Order Management**: Track orders and history
- **Customer Reviews**: Rating and feedback system

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `POST /api/payment/process` - Process payment
- `POST /api/reviews` - Create review
- `GET /api/health` - Health check

## MongoDB Collections

- **users**: User accounts and authentication
- **orders**: Customer orders with items and billing
- **reviews**: Product reviews and ratings

## Development

The platform uses MongoDB with proper indexing for performance. You can view and manage data using MongoDB Compass by connecting to your local MongoDB instance.

For production deployment, update the environment variables with secure keys and production MongoDB connection string.