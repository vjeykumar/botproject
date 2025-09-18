import pytest
import json

class TestCart:
    """Test cases for cart endpoints"""
    
    def test_get_cart_success(self, client, mock_db, auth_headers):
        """Test getting user cart"""
        response = client.get('/api/cart', headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'cart' in response_data
        assert 'items' in response_data['cart']
    
    def test_get_cart_create_if_not_exists(self, client, mock_db, auth_headers):
        """Test creating cart if it doesn't exist"""
        mock_db.carts.find_cart_by_user.return_value = None
        mock_db.carts.create_cart.return_value = {
            'id': '507f1f77bcf86cd799439014',
            'user_id': '507f1f77bcf86cd799439011',
            'items': []
        }
        
        response = client.get('/api/cart', headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'cart' in response_data
        mock_db.carts.create_cart.assert_called_once()
    
    def test_get_cart_unauthorized(self, client, mock_db):
        """Test getting cart without authentication"""
        response = client.get('/api/cart')
        
        assert response.status_code == 401
    
    def test_add_to_cart_success(self, client, mock_db, auth_headers):
        """Test adding item to cart"""
        item_data = {
            'id': 'item123',
            'name': 'Test Glass',
            'price': 50.0,
            'quantity': 2,
            'customization': {
                'height': 24,
                'width': 36
            }
        }
        
        mock_db.carts.add_item_to_cart.return_value = True
        
        response = client.post('/api/cart/items', json=item_data, headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'message' in response_data
        assert 'successfully' in response_data['message']
    
    def test_add_to_cart_missing_fields(self, client, mock_db, auth_headers):
        """Test adding item to cart with missing required fields"""
        incomplete_item = {
            'id': 'item123',
            'name': 'Test Glass'
            # Missing price and quantity
        }
        
        response = client.post('/api/cart/items', json=incomplete_item, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing required fields' in response_data['error']
    
    def test_add_to_cart_unauthorized(self, client, mock_db):
        """Test adding item to cart without authentication"""
        item_data = {
            'id': 'item123',
            'name': 'Test Glass',
            'price': 50.0,
            'quantity': 2
        }
        
        response = client.post('/api/cart/items', json=item_data)
        
        assert response.status_code == 401
    
    def test_update_cart_item_success(self, client, mock_db, auth_headers):
        """Test updating cart item"""
        item_id = 'item123'
        update_data = {'quantity': 3}
        
        mock_db.carts.update_cart_item.return_value = True
        
        response = client.put(f'/api/cart/items/{item_id}', json=update_data, headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'message' in response_data
        assert 'updated successfully' in response_data['message']
    
    def test_update_cart_item_not_found(self, client, mock_db, auth_headers):
        """Test updating non-existent cart item"""
        item_id = 'nonexistent'
        update_data = {'quantity': 3}
        
        mock_db.carts.update_cart_item.return_value = False
        
        response = client.put(f'/api/cart/items/{item_id}', json=update_data, headers=auth_headers)
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to update cart item' in response_data['error']
    
    def test_update_cart_item_unauthorized(self, client, mock_db):
        """Test updating cart item without authentication"""
        item_id = 'item123'
        update_data = {'quantity': 3}
        
        response = client.put(f'/api/cart/items/{item_id}', json=update_data)
        
        assert response.status_code == 401
    
    def test_remove_from_cart_success(self, client, mock_db, auth_headers):
        """Test removing item from cart"""
        item_id = 'item123'
        
        mock_db.carts.remove_item_from_cart.return_value = True
        
        response = client.delete(f'/api/cart/items/{item_id}', headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'message' in response_data
        assert 'removed' in response_data['message']
    
    def test_remove_from_cart_not_found(self, client, mock_db, auth_headers):
        """Test removing non-existent cart item"""
        item_id = 'nonexistent'
        
        mock_db.carts.remove_item_from_cart.return_value = False
        
        response = client.delete(f'/api/cart/items/{item_id}', headers=auth_headers)
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to remove item from cart' in response_data['error']
    
    def test_remove_from_cart_unauthorized(self, client, mock_db):
        """Test removing item from cart without authentication"""
        item_id = 'item123'
        
        response = client.delete(f'/api/cart/items/{item_id}')
        
        assert response.status_code == 401
    
    def test_clear_cart_success(self, client, mock_db, auth_headers):
        """Test clearing cart"""
        mock_db.carts.clear_cart.return_value = True
        
        response = client.delete('/api/cart/clear', headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'message' in response_data
        assert 'cleared successfully' in response_data['message']
    
    def test_clear_cart_failure(self, client, mock_db, auth_headers):
        """Test clearing cart failure"""
        mock_db.carts.clear_cart.return_value = False
        
        response = client.delete('/api/cart/clear', headers=auth_headers)
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to clear cart' in response_data['error']
    
    def test_clear_cart_unauthorized(self, client, mock_db):
        """Test clearing cart without authentication"""
        response = client.delete('/api/cart/clear')
        
        assert response.status_code == 401
    
    def test_cart_database_error(self, client, mock_db, auth_headers):
        """Test handling database errors in cart operations"""
        mock_db.carts.find_cart_by_user.side_effect = Exception("Database error")
        
        response = client.get('/api/cart', headers=auth_headers)
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to get cart' in response_data['error']