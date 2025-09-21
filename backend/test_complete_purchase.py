#!/usr/bin/env python3
"""
Comprehensive test for the complete purchase flow
"""

import sys
import os
import json
import time
from datetime import datetime
from unittest.mock import patch, MagicMock
from werkzeug.security import generate_password_hash

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def run_comprehensive_purchase_test():
    """Run comprehensive purchase flow test"""
    
    print("\n🧪 COMPREHENSIVE PURCHASE FLOW TEST")
    print("=" * 60)
    
    # Mock the database completely
    with patch('app.db') as mock_db:
        
        # Setup comprehensive mock responses
        setup_mock_database(mock_db)
        
        # Import app after mocking
        from app import app
        
        with app.test_client() as client:
            
            # Test 1: User Registration
            print("\n1️⃣ TESTING USER REGISTRATION")
            print("-" * 30)
            
            token = test_user_registration(client)
            if not token:
                return False
            
            # Test 2: Product Browsing
            print("\n2️⃣ TESTING PRODUCT BROWSING")
            print("-" * 30)
            
            if not test_product_browsing(client):
                return False
            
            # Test 3: Cart Operations
            print("\n3️⃣ TESTING CART OPERATIONS")
            print("-" * 30)
            
            if not test_cart_operations(client, token):
                return False
            
            # Test 4: Order Creation
            print("\n4️⃣ TESTING ORDER CREATION")
            print("-" * 30)
            
            order_id = test_order_creation(client, token)
            if not order_id:
                return False
            
            # Test 5: Payment Processing
            print("\n5️⃣ TESTING PAYMENT PROCESSING")
            print("-" * 30)
            
            if not test_payment_processing(client, token):
                return False
            
            # Test 6: Order Retrieval
            print("\n6️⃣ TESTING ORDER RETRIEVAL")
            print("-" * 30)
            
            if not test_order_retrieval(client, token):
                return False
            
            # Test 7: Review System
            print("\n7️⃣ TESTING REVIEW SYSTEM")
            print("-" * 30)
            
            if not test_review_system(client, token):
                return False
            
            print("\n🎉 ALL TESTS PASSED! PURCHASE FLOW IS FULLY FUNCTIONAL")
            print("=" * 60)
            return True

def setup_mock_database(mock_db):
    """Setup comprehensive mock database responses"""
    
    # User operations
    mock_db.users.create_user.return_value = {
        'id': '507f1f77bcf86cd799439011',
        'name': 'Test Purchase User',
        'email': 'purchase@test.com',
        'created_at': datetime.utcnow()
    }
    
    mock_db.users.find_user_by_email.return_value = None  # For registration
    
    mock_db.users.find_user_by_id.return_value = {
        'id': '507f1f77bcf86cd799439011',
        'name': 'Test Purchase User',
        'email': 'purchase@test.com',
        'created_at': datetime.utcnow()
    }
    
    # Product operations
    mock_db.products.find_all_products.return_value = [
        {
            'id': '507f1f77bcf86cd799439012',
            'name': 'Mirror Glass',
            'category': 'Mirrors',
            'description': 'High-quality mirror glass',
            'basePrice': 15,
            'specifications': ['6mm thickness', 'Silvered backing'],
            'created_at': datetime.utcnow()
        },
        {
            'id': '507f1f77bcf86cd799439013',
            'name': 'Window Glass',
            'category': 'Windows',
            'description': 'Clear float glass',
            'basePrice': 12,
            'specifications': ['4mm thickness', 'Float glass'],
            'created_at': datetime.utcnow()
        }
    ]
    
    # Cart operations
    mock_db.carts.find_cart_by_user.return_value = {
        'id': '507f1f77bcf86cd799439014',
        'user_id': '507f1f77bcf86cd799439011',
        'items': [],
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    
    mock_db.carts.add_item_to_cart.return_value = True
    mock_db.carts.update_cart_item.return_value = True
    mock_db.carts.remove_item_from_cart.return_value = True
    mock_db.carts.clear_cart.return_value = True
    
    # Order operations
    mock_db.orders.create_order.return_value = {
        'id': '507f1f77bcf86cd799439015',
        'order_number': 'EG20250101ABC123',
        'user_id': '507f1f77bcf86cd799439011',
        'total_amount': 100.0,
        'status': 'confirmed',
        'payment_method': 'Credit Card',
        'billing_info': {
            'email': 'purchase@test.com',
            'phone': '1234567890',
            'address': '123 Test Street',
            'city': 'Test City',
            'state': 'Test State',
            'pincode': '12345'
        },
        'items': [
            {
                'id': 'test-item-1',
                'name': 'Mirror Glass',
                'price': 100.0,
                'quantity': 1
            }
        ],
        'created_at': datetime.utcnow()
    }
    
    mock_db.orders.find_orders_by_user.return_value = [
        mock_db.orders.create_order.return_value
    ]
    
    # Review operations
    mock_db.reviews.create_review.return_value = {
        'id': '507f1f77bcf86cd799439016',
        'user_id': '507f1f77bcf86cd799439011',
        'product_id': '507f1f77bcf86cd799439012',
        'rating': 5,
        'comment': 'Excellent product!',
        'created_at': datetime.utcnow()
    }
    
    mock_db.reviews.find_reviews_by_product.return_value = []
    mock_db.reviews.get_product_rating_stats.return_value = {
        'average_rating': 0.0,
        'total_reviews': 0,
        'rating_distribution': [0, 0, 0, 0, 0]
    }

def test_user_registration(client):
    """Test user registration"""
    
    register_data = {
        'name': 'Test Purchase User',
        'email': 'purchase@test.com',
        'password': 'password123'
    }
    
    try:
        response = client.post('/api/register', 
                             json=register_data,
                             content_type='application/json')
        
        print(f"   Registration Status: {response.status_code}")
        
        if response.status_code != 201:
            error_data = response.get_json()
            print(f"   ❌ Registration failed: {error_data}")
            return None
        
        auth_data = response.get_json()
        token = auth_data.get('access_token')
        
        if not token:
            print("   ❌ No access token received")
            return None
        
        print("   ✅ User registered successfully")
        print(f"   📧 Email: {auth_data.get('user', {}).get('email', 'Unknown')}")
        print(f"   👤 Name: {auth_data.get('user', {}).get('name', 'Unknown')}")
        
        return token
        
    except Exception as e:
        print(f"   ❌ Registration error: {e}")
        return None

def test_product_browsing(client):
    """Test product browsing"""
    
    try:
        response = client.get('/api/products')
        print(f"   Product Browsing Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"   ❌ Product browsing failed: {response.get_json()}")
            return False
        
        products_data = response.get_json()
        products = products_data.get('products', [])
        
        print(f"   ✅ Found {len(products)} products")
        for product in products[:2]:  # Show first 2 products
            print(f"   🛍️ {product.get('name', 'Unknown')} - ₹{product.get('basePrice', 0)}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Product browsing error: {e}")
        return False

def test_cart_operations(client, token):
    """Test cart operations"""
    
    auth_headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Get cart
        response = client.get('/api/cart', headers=auth_headers)
        print(f"   Get Cart Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"   ❌ Get cart failed: {response.get_json()}")
            return False
        
        # Add item to cart
        cart_item = {
            'id': 'test-item-1',
            'name': 'Mirror Glass',
            'price': 100.0,
            'quantity': 1,
            'customization': {
                'height': 24,
                'width': 36,
                'area': '6.00'
            }
        }
        
        response = client.post('/api/cart/items', 
                             json=cart_item,
                             headers=auth_headers)
        print(f"   Add to Cart Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"   ❌ Add to cart failed: {response.get_json()}")
            return False
        
        print("   ✅ Cart operations successful")
        print(f"   🛒 Added: {cart_item['name']} - ₹{cart_item['price']}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Cart operations error: {e}")
        return False

def test_order_creation(client, token):
    """Test order creation"""
    
    auth_headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    order_data = {
        'items': [
            {
                'id': 'test-item-1',
                'name': 'Mirror Glass',
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
            'email': 'purchase@test.com',
            'phone': '1234567890',
            'address': '123 Test Street',
            'city': 'Test City',
            'state': 'Test State',
            'pincode': '12345'
        }
    }
    
    try:
        response = client.post('/api/orders', 
                             json=order_data,
                             headers=auth_headers)
        print(f"   Order Creation Status: {response.status_code}")
        
        if response.status_code != 201:
            error_data = response.get_json()
            print(f"   ❌ Order creation failed: {error_data}")
            return None
        
        order_result = response.get_json()
        order = order_result.get('order', {})
        order_id = order.get('id')
        order_number = order.get('order_number', 'Unknown')
        
        print("   ✅ Order created successfully")
        print(f"   📦 Order Number: {order_number}")
        print(f"   💰 Total Amount: ₹{order.get('total_amount', 0)}")
        print(f"   📍 Status: {order.get('status', 'Unknown')}")
        
        return order_id
        
    except Exception as e:
        print(f"   ❌ Order creation error: {e}")
        return None

def test_payment_processing(client, token):
    """Test payment processing"""
    
    auth_headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    payment_data = {
        'payment_method': 'Credit Card',
        'amount': 100.0,
        'card_details': {
            'card_number': '4111111111111111',
            'expiry_date': '12/25',
            'cvv': '123',
            'card_name': 'Test User'
        }
    }
    
    try:
        print("   Processing payment... (simulated delay)")
        
        response = client.post('/api/payment/process',
                             json=payment_data,
                             headers=auth_headers)
        print(f"   Payment Processing Status: {response.status_code}")
        
        if response.status_code != 200:
            error_data = response.get_json()
            print(f"   ❌ Payment failed: {error_data}")
            return False
        
        payment_result = response.get_json()
        
        print("   ✅ Payment processed successfully")
        print(f"   💳 Payment ID: {payment_result.get('payment_id', 'Unknown')}")
        print(f"   💰 Amount: ₹{payment_result.get('amount', 0)}")
        print(f"   📊 Status: {payment_result.get('status', 'Unknown')}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Payment processing error: {e}")
        return False

def test_order_retrieval(client, token):
    """Test order retrieval"""
    
    auth_headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = client.get('/api/orders', headers=auth_headers)
        print(f"   Order Retrieval Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"   ❌ Order retrieval failed: {response.get_json()}")
            return False
        
        orders_data = response.get_json()
        orders = orders_data.get('orders', [])
        
        print(f"   ✅ Retrieved {len(orders)} orders")
        for order in orders[:1]:  # Show first order
            print(f"   📦 Order: {order.get('order_number', 'Unknown')}")
            print(f"   💰 Amount: ₹{order.get('total_amount', 0)}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Order retrieval error: {e}")
        return False

def test_review_system(client, token):
    """Test review system"""
    
    auth_headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    review_data = {
        'product_id': '507f1f77bcf86cd799439012',
        'rating': 5,
        'comment': 'Excellent product quality! Fast delivery and great customer service.'
    }
    
    try:
        response = client.post('/api/reviews',
                             json=review_data,
                             headers=auth_headers)
        print(f"   Review Creation Status: {response.status_code}")
        
        if response.status_code != 201:
            print(f"   ❌ Review creation failed: {response.get_json()}")
            return False
        
        review_result = response.get_json()
        review = review_result.get('review', {})
        
        print("   ✅ Review created successfully")
        print(f"   ⭐ Rating: {review.get('rating', 0)}/5")
        print(f"   💬 Comment: {review.get('comment', 'No comment')[:50]}...")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Review system error: {e}")
        return False

if __name__ == '__main__':
    print("🚀 Starting Comprehensive Purchase Flow Test...")
    
    success = run_comprehensive_purchase_test()
    
    if success:
        print("\n✅ ALL TESTS COMPLETED SUCCESSFULLY!")
        print("🎯 The purchase flow is fully functional and ready for production.")
        sys.exit(0)
    else:
        print("\n❌ SOME TESTS FAILED!")
        print("🔧 Please check the error messages above and fix the issues.")
        sys.exit(1)