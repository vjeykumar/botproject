# Edgecraft Glass Backend

Flask backend with MongoDB integration for the Edgecraft Glass ordering platform.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service: `mongod`
3. MongoDB will be available at `mongodb://localhost:27017/`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string from Atlas dashboard
4. Update MONGODB_URI in .env file

#### Option C: MongoDB Compass
1. Install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to your MongoDB instance
3. Create database: `edgecraft_glass`
4. Collections will be created automatically

### 3. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=edgecraft_glass
FLASK_ENV=development
```

### 4. Run the Server
```bash
python app.py
```

Server will start at `http://localhost:5000`

## Database Collections

### Users Collection
```json
{
  "_id": ObjectId,
  "name": "string",
  "email": "string",
  "password_hash": "string",
  "created_at": "datetime"
}
```

### Orders Collection
```json
{
  "_id": ObjectId,
  "order_number": "string",
  "user_id": "string",
  "total_amount": "number",
  "status": "string",
  "payment_method": "string",
  "billing_info": "object",
  "items": "array",
  "created_at": "datetime"
}
```

### Reviews Collection
```json
{
  "_id": ObjectId,
  "user_id": "string",
  "product_id": "string",
  "rating": "number",
  "comment": "string",
  "created_at": "datetime"
}
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (protected)

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/<id>` - Get specific order (protected)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/<product_id>` - Get product reviews

### Payment
- `POST /api/payment/process` - Process payment (protected)

### System
- `GET /api/health` - Health check
- `GET /api/db/stats` - Database statistics (protected)

## MongoDB Compass Integration

1. **Connect to Database**: Use connection string from .env
2. **View Collections**: Browse users, orders, reviews collections
3. **Query Data**: Use Compass query interface
4. **Monitor Performance**: View query performance and indexes
5. **Data Visualization**: Use Compass charts and graphs

## Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **MongoDB Integration**: Full CRUD operations with MongoDB
- **Error Handling**: Comprehensive error handling and logging
- **Indexing**: Optimized database indexes for performance
- **Data Validation**: Input validation and sanitization
- **CORS Support**: Cross-origin requests enabled

## Testing

The API includes comprehensive test coverage for all endpoints and functionality.

### Running Tests

#### Install Test Dependencies
```bash
pip install -r requirements-test.txt
```

#### Run All Tests
```bash
python tests/run_tests.py
```

#### Run Specific Test Categories
```bash
# Unit tests only
python tests/run_tests.py unit

# Integration tests
python tests/run_tests.py integration

# Authentication tests
python tests/run_tests.py auth

# Product tests
python tests/run_tests.py products

# Order tests
python tests/run_tests.py orders

# Cart tests
python tests/run_tests.py cart

# Review tests
python tests/run_tests.py reviews

# Payment tests
python tests/run_tests.py payment

# Health check tests
python tests/run_tests.py health

# Database tests
python tests/run_tests.py database

# Error handling tests
python tests/run_tests.py error
```

#### Run Tests with Coverage
```bash
python tests/run_tests.py --coverage
```

#### Run Tests with Verbose Output
```bash
python tests/run_tests.py --verbose
```

### Test Structure

- `test_auth.py` - Authentication endpoint tests
- `test_products.py` - Product management tests
- `test_orders.py` - Order creation and management tests
- `test_cart.py` - Shopping cart functionality tests
- `test_reviews.py` - Review system tests
- `test_payment.py` - Payment processing tests
- `test_health.py` - Health check and system status tests
- `test_database.py` - Database operation tests
- `test_error_handlers.py` - Error handling tests
- `test_integration.py` - End-to-end integration tests

### Test Coverage

The test suite covers:
- ✅ All API endpoints
- ✅ Authentication and authorization
- ✅ Data validation
- ✅ Error handling
- ✅ Database operations
- ✅ Integration workflows
- ✅ Edge cases and security

### Continuous Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    pip install -r requirements.txt
    pip install -r requirements-test.txt
    python tests/run_tests.py --coverage
```