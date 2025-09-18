import pytest
import os
import sys
from datetime import datetime
from unittest.mock import patch, MagicMock

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app import app
from database.mongodb import EdgecraftDB

@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app.config['TESTING'] = True
    app.config['JWT_SECRET_KEY'] = 'test-jwt-secret'
    
    with app.test_client() as client:
        with app.app_context():
            yield client

@pytest.fixture
def mock_db():
    """Mock database for testing"""
    with patch('app.db') as mock_db:
        # Mock user operations
        mock_db.users.create_user.return_value = {
            'id': '507f1f77bcf86cd799439011',
            'name': 'Test User',
            'email': 'test@example.com',
            'created_at': datetime.utcnow()
        }
        
        mock_db.users.find_user_by_email.return_value = {
            'id': '507f1f77bcf86cd799439011',
            'name': 'Test User',
            'email': 'test@example.com',
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/kzd9jFvPW',  # 'password123'
            'created_at': datetime.utcnow()
        }
        
        mock_db.users.find_user_by_id.return_value = {
            'id': '507f1f77bcf86cd799439011',
            'name': 'Test User',
            'email': 'test@example.com',
            'created_at': datetime.utcnow()
        }
        
        # Mock product operations
        mock_db.products.find_all_products.return_value = [
            {
                'id': '507f1f77bcf86cd799439012',
                'name': 'Mirror Glass',
                'category': 'Mirrors',
                'description': 'High-quality mirror glass',
                'basePrice': 15,
                'specifications': ['6mm thickness', 'Silvered backing'],
                'created_at': datetime.utcnow()
            }
        ]
        
        mock_db.products.create_product.return_value = {
            'id': '507f1f77bcf86cd799439012',
            'name': 'Test Product',
            'category': 'Test',
            'description': 'Test product',
            'basePrice': 20,
            'specifications': ['Test spec'],
            'created_at': datetime.utcnow()
        }
        
        # Mock order operations
        mock_db.orders.create_order.return_value = {
            'id': '507f1f77bcf86cd799439013',
            'order_number': 'EG20250101ABC123',
            'user_id': '507f1f77bcf86cd799439011',
            'total_amount': 100.0,
            'status': 'confirmed',
            'payment_method': 'Credit Card',
            'billing_info': {
                'email': 'test@example.com',
                'phone': '1234567890',
                'address': '123 Test St',
                'city': 'Test City',
                'state': 'Test State',
                'pincode': '12345'
            },
            'items': [
                {
                    'id': 'item1',
                    'name': 'Test Item',
                    'price': 100.0,
                    'quantity': 1
                }
            ],
            'created_at': datetime.utcnow()
        }
        
        mock_db.orders.find_orders_by_user.return_value = []
        
        # Mock cart operations
        mock_db.carts.find_cart_by_user.return_value = {
            'id': '507f1f77bcf86cd799439014',
            'user_id': '507f1f77bcf86cd799439011',
            'items': [],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        mock_db.carts.clear_cart.return_value = True
        
        # Mock review operations
        mock_db.reviews.create_review.return_value = {
            'id': '507f1f77bcf86cd799439015',
            'user_id': '507f1f77bcf86cd799439011',
            'product_id': '507f1f77bcf86cd799439012',
            'rating': 5,
            'comment': 'Great product!',
            'created_at': datetime.utcnow()
        }
        
        mock_db.reviews.find_reviews_by_product.return_value = []
        mock_db.reviews.get_product_rating_stats.return_value = {
            'average_rating': 0.0,
            'total_reviews': 0,
            'rating_distribution': [0, 0, 0, 0, 0]
        }
        
        # Mock database stats
        mock_db.get_db_stats.return_value = {
            'users_count': 1,
            'products_count': 1,
            'orders_count': 0,
            'reviews_count': 0,
            'database_name': 'test_db',
            'collections': ['users', 'products', 'orders', 'reviews']
        }
        
        yield mock_db

@pytest.fixture
def auth_headers(client, mock_db):
    """Get authentication headers for protected routes"""
    # Register and login a test user
    register_data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'password123'
    }
    
    response = client.post('/api/register', json=register_data)
    assert response.status_code == 201
    
    data = response.get_json()
    token = data['access_token']
    
    return {'Authorization': f'Bearer {token}'}

@pytest.fixture
def sample_product():
    """Sample product data for testing"""
    return {
        'name': 'Test Glass',
        'category': 'Test Category',
        'description': 'Test glass product',
        'basePrice': 25,
        'specifications': ['Test spec 1', 'Test spec 2']
    }

@pytest.fixture
def sample_order():
    """Sample order data for testing"""
    return {
        'items': [
            {
                'id': 'item1',
                'name': 'Test Item',
                'price': 100.0,
                'quantity': 1,
                'customization': {
                    'height': 24,
                    'width': 36,
                    'area': '6.00'
                }
            }
        ],
        'total_amount': 100.0,
        'payment_method': 'Credit Card',
        'billing_info': {
            'email': 'test@example.com',
            'phone': '1234567890',
            'address': '123 Test Street',
            'city': 'Test City',
            'state': 'Test State',
            'pincode': '12345'
        }
    }

@pytest.fixture
def sample_review():
    """Sample review data for testing"""
    return {
        'product_id': '507f1f77bcf86cd799439012',
        'rating': 5,
        'comment': 'Excellent product quality!'
    }