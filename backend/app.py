from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from datetime import datetime, timedelta
import os
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import atexit
from database.mongodb import db

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

# Ensure database connection is closed when the server process exits
atexit.register(db.close)

# Helper functions
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return generate_password_hash(password)

def check_password(password: str, password_hash: str) -> bool:
    """Check password against hash"""
    return check_password_hash(password_hash, password)

# Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        category = request.args.get('category')
        
        if category:
            products = db.products.find_products_by_category(category)
        else:
            products = db.products.find_all_products()
        
        return jsonify({
            'products': products
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get products'}), 500

@app.route('/api/products', methods=['POST'])
@jwt_required()
def create_product():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category', 'description', 'basePrice', 'specifications']
        if not all(k in data for k in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        product = db.products.create_product(data)
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to create product'}), 500

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = db.products.find_product_by_id(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({'product': product}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get product'}), 500

@app.route('/api/cart', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        user_id = get_jwt_identity()
        cart = db.carts.find_cart_by_user(user_id)
        
        if not cart:
            cart = db.carts.create_cart(user_id)
        
        return jsonify({'cart': cart}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get cart'}), 500

@app.route('/api/cart/items', methods=['POST'])
@jwt_required()
def add_to_cart():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['id', 'name', 'price', 'quantity']
        if not all(k in data for k in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Add timestamp to item
        data['added_at'] = datetime.utcnow()
        
        success = db.carts.add_item_to_cart(user_id, data)
        
        if success:
            return jsonify({'message': 'Item added to cart successfully'}), 200
        else:
            return jsonify({'error': 'Failed to add item to cart'}), 500
        
    except Exception as e:
        return jsonify({'error': 'Failed to add item to cart'}), 500

@app.route('/api/cart/items/<item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        success = db.carts.update_cart_item(user_id, item_id, data)
        
        if success:
            return jsonify({'message': 'Cart item updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update cart item'}), 500
        
    except Exception as e:
        return jsonify({'error': 'Failed to update cart item'}), 500

@app.route('/api/cart/items/<item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    try:
        user_id = get_jwt_identity()
        
        success = db.carts.remove_item_from_cart(user_id, item_id)
        
        if success:
            return jsonify({'message': 'Item removed from cart successfully'}), 200
        else:
            return jsonify({'error': 'Failed to remove item from cart'}), 500
        
    except Exception as e:
        return jsonify({'error': 'Failed to remove item from cart'}), 500

@app.route('/api/cart/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    try:
        user_id = get_jwt_identity()
        
        success = db.carts.clear_cart(user_id)
        
        if success:
            return jsonify({'message': 'Cart cleared successfully'}), 200
        else:
            return jsonify({'error': 'Failed to clear cart'}), 500
        
    except Exception as e:
        return jsonify({'error': 'Failed to clear cart'}), 500

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('name', 'email', 'password')):
            print("❌ Missing required fields")
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        existing_user = db.users.find_user_by_email(data['email'])
        if existing_user:
            print("❌ Email already registered")
            return jsonify({'error': 'Email already registered'}), 400
        
        print("✅ Creating new user")
        # Create new user
        user_data = {
            'name': data['name'],
            'email': data['email'],
            'password_hash': hash_password(data['password'])
        }
        
        user = db.users.create_user(user_data)
        print("👤 User created successfully")
        
        # Remove password hash from response
        del user['password_hash']
        
        # Set default role
        user['role'] = 'user'
        
        # Create access token
        access_token = create_access_token(identity=user['id'])
        print("🎫 Access token created for new user")
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user
        }), 201
        
    except ValueError as e:
        print(f"❌ Validation error: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"💥 Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        print("🔐 Login attempt received")
        data = request.get_json()
        print(f"📧 Login data: {data.get('email', 'No email')}")
        
        if not all(k in data for k in ('email', 'password')):
            print("❌ Missing email or password")
            return jsonify({'error': 'Missing email or password'}), 400
        
        user = db.users.find_user_by_email(data['email'])
        print(f"👤 User found: {user is not None}")
        
        if user and check_password(data['password'], user['password_hash']):
            print("✅ Password verified")
            # Check if user is admin based on email
            if 'admin' in user['email'].lower():
                user['role'] = 'admin'
                print("🔑 Admin role assigned")
            else:
                user['role'] = 'user'
                print("👤 User role assigned")
                
            # Remove password hash from response
            del user['password_hash']
            
            access_token = create_access_token(identity=user['id'])
            print("🎫 Access token created")
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': user
            }), 200
        else:
            print("❌ Invalid credentials")
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        print(f"💥 Login error: {e}")
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = db.users.find_user_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Remove password hash from response
        del user['password_hash']
        
        return jsonify({'user': user}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get profile'}), 500

@app.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        print(f"📦 Order data received: {data}")
        
        # Validate required fields
        required_fields = ['items', 'total_amount', 'payment_method', 'billing_info']
        if not all(k in data for k in required_fields):
            print(f"❌ Missing required fields. Received: {list(data.keys())}")
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate items array
        if not isinstance(data['items'], list) or len(data['items']) == 0:
            print("❌ Items must be a non-empty array")
            return jsonify({'error': 'Items must be a non-empty array'}), 400
        
        # Validate billing_info structure
        billing_required = ['email', 'phone', 'address', 'city', 'state', 'pincode']
        if not all(k in data['billing_info'] for k in billing_required):
            print(f"❌ Missing billing info fields. Received: {list(data['billing_info'].keys())}")
            return jsonify({'error': 'Missing required billing information'}), 400
        
        # Create order data
        order_data = {
            'user_id': user_id,
            'total_amount': data['total_amount'],
            'payment_method': data['payment_method'],
            'billing_info': data['billing_info'],
            'status': 'confirmed',
            'items': data['items']
        }
        
        print(f"✅ Creating order with data: {order_data}")
        order = db.orders.create_order(order_data)
        print(f"✅ Order created successfully: {order.get('order_number', 'Unknown')}")
        
        # Clear cart after successful order
        try:
            db.carts.clear_cart(user_id)
            print("✅ Cart cleared successfully")
        except Exception as cart_error:
            print(f"⚠️ Failed to clear cart: {cart_error}")
            # Don't fail the order creation if cart clearing fails
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order
        }), 201
        
    except ValueError as e:
        print(f"❌ Validation error in create_order: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"💥 Error in create_order: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to create order: {str(e)}'}), 500

@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    try:
        user_id = get_jwt_identity()
        orders = db.orders.find_orders_by_user(user_id)
        
        return jsonify({
            'orders': orders
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get orders'}), 500

@app.route('/api/orders/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    try:
        user_id = get_jwt_identity()
        order = db.orders.find_order_by_id(order_id, user_id)
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({'order': order}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get order'}), 500

@app.route('/api/reviews', methods=['POST'])
@jwt_required()
def create_review():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not all(k in data for k in ('product_id', 'rating')):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if not 1 <= data['rating'] <= 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        review_data = {
            'user_id': user_id,
            'product_id': data['product_id'],
            'rating': data['rating'],
            'comment': data.get('comment', '')
        }
        
        review = db.reviews.create_review(review_data)
        
        return jsonify({
            'message': 'Review created successfully',
            'review': review
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to create review'}), 500

@app.route('/api/reviews/<product_id>', methods=['GET'])
def get_reviews(product_id):
    try:
        reviews = db.reviews.find_reviews_by_product(product_id)
        stats = db.reviews.get_product_rating_stats(product_id)
        
        return jsonify({
            'reviews': reviews,
            'stats': stats
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get reviews'}), 500

@app.route('/api/payment/process', methods=['POST'])
@jwt_required()
def process_payment():
    try:
        data = request.get_json()
        
        # Simulate payment processing
        payment_method = data.get('payment_method')
        amount = data.get('amount')
        
        if not payment_method or not amount:
            return jsonify({'error': 'Missing payment details'}), 400
        
        # Simulate payment processing delay
        import time
        time.sleep(2)
        
        # Simulate successful payment
        payment_id = f"pay_{uuid.uuid4().hex[:12]}"
        
        return jsonify({
            'status': 'success',
            'payment_id': payment_id,
            'amount': amount,
            'payment_method': payment_method,
            'message': 'Payment processed successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Payment processing failed'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Check database connection
        stats = db.get_db_stats()
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'database': 'connected',
            'stats': stats
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'timestamp': datetime.utcnow().isoformat(),
            'database': 'disconnected',
            'error': str(e)
        }), 500

@app.route('/api/db/stats', methods=['GET'])
@jwt_required()
def get_db_stats():
    """Get database statistics (admin endpoint)"""
    try:
        stats = db.get_db_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': 'Failed to get database stats'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    try:
        print("🚀 Starting Edgecraft Glass API Server...")
        print("📊 Database connection established")
        print("🔐 JWT authentication enabled")
        print("🌐 CORS enabled for frontend integration")
        print("📱 API endpoints ready")
        print("=" * 50)

        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
