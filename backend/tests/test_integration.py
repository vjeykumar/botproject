import pytest
import json
from unittest.mock import patch
from werkzeug.security import generate_password_hash

class TestIntegration:
    """Integration test cases for complete workflows"""
    
    def test_complete_user_journey(self, client, mock_db):
        """Test complete user journey from registration to order"""
        # Step 1: Register user
        register_data = {
            'name': 'Integration Test User',
            'email': 'integration@test.com',
            'password': 'password123'
        }
        
        response = client.post('/api/register', json=register_data)
        assert response.status_code == 201
        
        auth_data = response.get_json()
        auth_headers = {'Authorization': f'Bearer {auth_data["access_token"]}'}
        
        # Step 2: Get products
        response = client.get('/api/products')
        assert response.status_code == 200
        
        # Step 3: Get user profile
        response = client.get('/api/profile', headers=auth_headers)
        assert response.status_code == 200
        
        # Step 4: Add item to cart
        cart_item = {
            'id': 'item123',
            'name': 'Test Glass',
            'price': 100.0,
            'quantity': 1
        }
        
        response = client.post('/api/cart/items', json=cart_item, headers=auth_headers)
        assert response.status_code == 200
        
        # Step 5: Get cart
        response = client.get('/api/cart', headers=auth_headers)
        assert response.status_code == 200
        
        # Step 6: Create order
        order_data = {
            'items': [cart_item],
            'total_amount': 100.0,
            'payment_method': 'Credit Card',
            'billing_info': {
                'email': 'integration@test.com',
                'phone': '1234567890',
                'address': '123 Test St',
                'city': 'Test City',
                'state': 'Test State',
                'pincode': '12345'
            }
        }
        
        response = client.post('/api/orders', json=order_data, headers=auth_headers)
        assert response.status_code == 201
        
        # Step 7: Get orders
        response = client.get('/api/orders', headers=auth_headers)
        assert response.status_code == 200
    
    def test_admin_workflow(self, client, mock_db):
        """Test admin workflow"""
        # Step 1: Login as admin
        mock_db.users.find_user_by_email.return_value = {
            'id': '507f1f77bcf86cd799439011',
            'name': 'Admin User',
            'email': 'admin@edgecraftglass.com',
            'password_hash': generate_password_hash('admin123'),
            'created_at': '2025-01-01T00:00:00'
        }
        
        login_data = {
            'email': 'admin@edgecraftglass.com',
            'password': 'password123'
        }
        
        with patch('app.check_password', return_value=True):
            response = client.post('/api/login', json=login_data)
        
        assert response.status_code == 200
        auth_data = response.get_json()
        assert auth_data['user']['role'] == 'admin'
        
        auth_headers = {'Authorization': f'Bearer {auth_data["access_token"]}'}
        
        # Step 2: Create product (admin only)
        product_data = {
            'name': 'Admin Created Product',
            'category': 'Admin',
            'description': 'Product created by admin',
            'basePrice': 50,
            'specifications': ['Admin spec']
        }
        
        response = client.post('/api/products', json=product_data, headers=auth_headers)
        assert response.status_code == 201
        
        # Step 3: Get database stats (admin only)
        response = client.get('/api/db/stats', headers=auth_headers)
        assert response.status_code == 200
    
    def test_review_workflow(self, client, mock_db, auth_headers):
        """Test review creation and retrieval workflow"""
        product_id = '507f1f77bcf86cd799439012'
        
        # Step 1: Create review
        review_data = {
            'product_id': product_id,
            'rating': 5,
            'comment': 'Excellent product quality!'
        }
        
        response = client.post('/api/reviews', json=review_data, headers=auth_headers)
        assert response.status_code == 201
        
        # Step 2: Get reviews for product
        mock_db.reviews.find_reviews_by_product.return_value = [
            {
                'id': '507f1f77bcf86cd799439015',
                'product_id': product_id,
                'rating': 5,
                'comment': 'Excellent product quality!',
                'user_name': 'Test User',
                'created_at': '2025-01-01T00:00:00'
            }
        ]
        
        response = client.get(f'/api/reviews/{product_id}')
        assert response.status_code == 200
        
        response_data = response.get_json()
        assert len(response_data['reviews']) == 1
        assert response_data['reviews'][0]['rating'] == 5
    
    def test_payment_and_order_workflow(self, client, mock_db, auth_headers):
        """Test payment processing and order creation workflow"""
        # Step 1: Process payment
        payment_data = {
            'payment_method': 'Credit Card',
            'amount': 150.0
        }
        
        response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        assert response.status_code == 200
        
        payment_result = response.get_json()
        assert payment_result['status'] == 'success'
        
        # Step 2: Create order after successful payment
        order_data = {
            'items': [
                {
                    'id': 'item1',
                    'name': 'Test Glass',
                    'price': 150.0,
                    'quantity': 1
                }
            ],
            'total_amount': 150.0,
            'payment_method': 'Credit Card',
            'billing_info': {
                'email': 'test@example.com',
                'phone': '1234567890',
                'address': '123 Test St',
                'city': 'Test City',
                'state': 'Test State',
                'pincode': '12345'
            }
        }
        
        response = client.post('/api/orders', json=order_data, headers=auth_headers)
        assert response.status_code == 201
        
        order_result = response.get_json()
        assert 'order' in order_result
        assert order_result['order']['total_amount'] == 150.0
    
    def test_cart_to_order_workflow(self, client, mock_db, auth_headers):
        """Test complete cart to order workflow"""
        # Step 1: Add multiple items to cart
        items = [
            {
                'id': 'item1',
                'name': 'Mirror Glass',
                'price': 75.0,
                'quantity': 1
            },
            {
                'id': 'item2',
                'name': 'Window Glass',
                'price': 50.0,
                'quantity': 2
            }
        ]
        
        for item in items:
            response = client.post('/api/cart/items', json=item, headers=auth_headers)
            assert response.status_code == 200
        
        # Step 2: Get cart to verify items
        response = client.get('/api/cart', headers=auth_headers)
        assert response.status_code == 200
        
        # Step 3: Update cart item quantity
        response = client.put('/api/cart/items/item1', json={'quantity': 2}, headers=auth_headers)
        assert response.status_code == 200
        
        # Step 4: Create order from cart
        order_data = {
            'items': items,
            'total_amount': 175.0,  # 75*2 + 50*2
            'payment_method': 'UPI',
            'billing_info': {
                'email': 'test@example.com',
                'phone': '1234567890',
                'address': '123 Test St',
                'city': 'Test City',
                'state': 'Test State',
                'pincode': '12345'
            }
        }
        
        response = client.post('/api/orders', json=order_data, headers=auth_headers)
        assert response.status_code == 201
        
        # Step 5: Verify cart is cleared after order
        # This would be tested if the cart clearing functionality is working
        mock_db.carts.clear_cart.assert_called()
    
    def test_error_recovery_workflow(self, client, mock_db):
        """Test error recovery in workflows"""
        # Step 1: Try to access protected endpoint without auth
        response = client.get('/api/profile')
        assert response.status_code == 401
        
        # Step 2: Register user
        register_data = {
            'name': 'Recovery Test User',
            'email': 'recovery@test.com',
            'password': 'password123'
        }
        
        response = client.post('/api/register', json=register_data)
        assert response.status_code == 201
        
        auth_data = response.get_json()
        auth_headers = {'Authorization': f'Bearer {auth_data["access_token"]}'}
        
        # Step 3: Now access protected endpoint successfully
        response = client.get('/api/profile', headers=auth_headers)
        assert response.status_code == 200
        
        # Step 4: Try to create order with invalid data
        invalid_order = {
            'items': [],  # Empty items
            'total_amount': 100.0,
            'payment_method': 'Credit Card'
            # Missing billing_info
        }
        
        response = client.post('/api/orders', json=invalid_order, headers=auth_headers)
        assert response.status_code == 400
        
        # Step 5: Create valid order
        valid_order = {
            'items': [
                {
                    'id': 'item1',
                    'name': 'Test Glass',
                    'price': 100.0,
                    'quantity': 1
                }
            ],
            'total_amount': 100.0,
            'payment_method': 'Credit Card',
            'billing_info': {
                'email': 'recovery@test.com',
                'phone': '1234567890',
                'address': '123 Test St',
                'city': 'Test City',
                'state': 'Test State',
                'pincode': '12345'
            }
        }
        
        response = client.post('/api/orders', json=valid_order, headers=auth_headers)
        assert response.status_code == 201