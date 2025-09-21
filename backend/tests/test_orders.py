import pytest
import json

class TestOrders:
    """Test cases for order endpoints"""
    
    def test_create_order_success(self, client, mock_db, auth_headers, sample_order):
        """Test creating a new order successfully"""
        response = client.post('/api/orders', json=sample_order, headers=auth_headers)
        
        assert response.status_code == 201
        response_data = response.get_json()
        assert 'message' in response_data
        assert 'order' in response_data
        assert response_data['order']['total_amount'] == sample_order['total_amount']
        assert response_data['order']['payment_method'] == sample_order['payment_method']
    
    def test_create_order_missing_fields(self, client, mock_db, auth_headers):
        """Test creating an order with missing required fields"""
        incomplete_order = {
            'items': [{'id': 'item1', 'name': 'Test', 'price': 100, 'quantity': 1}],
            'total_amount': 100.0
            # Missing payment_method and billing_info
        }
        
        response = client.post('/api/orders', json=incomplete_order, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing required fields' in response_data['error']
    
    def test_create_order_empty_items(self, client, mock_db, auth_headers):
        """Test creating an order with empty items array"""
        order_data = {
            'items': [],  # Empty items array
            'total_amount': 100.0,
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
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Items must be a non-empty array' in response_data['error']
    
    def test_create_order_invalid_items(self, client, mock_db, auth_headers):
        """Test creating an order with invalid items format"""
        order_data = {
            'items': 'not_an_array',  # Invalid items format
            'total_amount': 100.0,
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
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Items must be a non-empty array' in response_data['error']
    
    def test_create_order_incomplete_billing_info(self, client, mock_db, auth_headers):
        """Test creating an order with incomplete billing information"""
        order_data = {
            'items': [{'id': 'item1', 'name': 'Test', 'price': 100, 'quantity': 1}],
            'total_amount': 100.0,
            'payment_method': 'Credit Card',
            'billing_info': {
                'email': 'test@example.com',
                'phone': '1234567890'
                # Missing address, city, state, pincode
            }
        }
        
        response = client.post('/api/orders', json=order_data, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing required billing information' in response_data['error']
    
    def test_create_order_unauthorized(self, client, mock_db, sample_order):
        """Test creating an order without authentication"""
        response = client.post('/api/orders', json=sample_order)
        
        assert response.status_code == 401
    
    def test_get_orders_success(self, client, mock_db, auth_headers):
        """Test getting user orders"""
        mock_orders = [
            {
                'id': '507f1f77bcf86cd799439013',
                'order_number': 'EG20250101ABC123',
                'total_amount': 100.0,
                'status': 'confirmed',
                'created_at': '2025-01-01T00:00:00'
            }
        ]
        mock_db.orders.find_orders_by_user.return_value = mock_orders
        
        response = client.get('/api/orders', headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'orders' in response_data
        assert len(response_data['orders']) == 1
        assert response_data['orders'][0]['order_number'] == 'EG20250101ABC123'
    
    def test_get_orders_unauthorized(self, client, mock_db):
        """Test getting orders without authentication"""
        response = client.get('/api/orders')
        
        assert response.status_code == 401
    
    def test_get_order_by_id_success(self, client, mock_db, auth_headers):
        """Test getting a specific order by ID"""
        order_id = '507f1f77bcf86cd799439013'
        mock_order = {
            'id': order_id,
            'order_number': 'EG20250101ABC123',
            'total_amount': 100.0,
            'status': 'confirmed'
        }
        mock_db.orders.find_order_by_id.return_value = mock_order
        
        response = client.get(f'/api/orders/{order_id}', headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'order' in response_data
        assert response_data['order']['id'] == order_id
    
    def test_get_order_by_id_not_found(self, client, mock_db, auth_headers):
        """Test getting a non-existent order"""
        order_id = '507f1f77bcf86cd799439999'
        mock_db.orders.find_order_by_id.return_value = None
        
        response = client.get(f'/api/orders/{order_id}', headers=auth_headers)
        
        assert response.status_code == 404
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Order not found' in response_data['error']
    
    def test_get_order_by_id_unauthorized(self, client, mock_db):
        """Test getting an order without authentication"""
        order_id = '507f1f77bcf86cd799439013'
        
        response = client.get(f'/api/orders/{order_id}')
        
        assert response.status_code == 401
    
    def test_create_order_database_error(self, client, mock_db, auth_headers, sample_order):
        """Test handling database errors when creating orders"""
        mock_db.orders.create_order.side_effect = Exception("Database connection failed")
        
        response = client.post('/api/orders', json=sample_order, headers=auth_headers)
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to create order' in response_data['error']
    
    def test_get_orders_database_error(self, client, mock_db, auth_headers):
        """Test handling database errors when getting orders"""
        mock_db.orders.find_orders_by_user.side_effect = Exception("Database error")
        
        response = client.get('/api/orders', headers=auth_headers)
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to get orders' in response_data['error']