import pytest
import json

class TestProducts:
    """Test cases for product endpoints"""
    
    def test_get_all_products_success(self, client, mock_db):
        """Test getting all products"""
        response = client.get('/api/products')
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'products' in response_data
        assert isinstance(response_data['products'], list)
    
    def test_get_products_by_category(self, client, mock_db):
        """Test getting products by category"""
        mock_db.products.find_products_by_category.return_value = [
            {
                'id': '507f1f77bcf86cd799439012',
                'name': 'Mirror Glass',
                'category': 'Mirrors',
                'description': 'High-quality mirror glass',
                'basePrice': 15
            }
        ]
        
        response = client.get('/api/products?category=Mirrors')
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'products' in response_data
        mock_db.products.find_products_by_category.assert_called_once_with('Mirrors')
    
    def test_get_product_by_id_success(self, client, mock_db):
        """Test getting a specific product by ID"""
        product_id = '507f1f77bcf86cd799439012'
        mock_db.products.find_product_by_id.return_value = {
            'id': product_id,
            'name': 'Mirror Glass',
            'category': 'Mirrors',
            'description': 'High-quality mirror glass',
            'basePrice': 15
        }
        
        response = client.get(f'/api/products/{product_id}')
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'product' in response_data
        assert response_data['product']['id'] == product_id
    
    def test_get_product_by_id_not_found(self, client, mock_db):
        """Test getting a non-existent product"""
        product_id = '507f1f77bcf86cd799439999'
        mock_db.products.find_product_by_id.return_value = None
        
        response = client.get(f'/api/products/{product_id}')
        
        assert response.status_code == 404
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Product not found' in response_data['error']
    
    def test_create_product_success(self, client, mock_db, auth_headers, sample_product):
        """Test creating a new product"""
        response = client.post('/api/products', json=sample_product, headers=auth_headers)
        
        assert response.status_code == 201
        response_data = response.get_json()
        assert 'message' in response_data
        assert 'product' in response_data
        assert response_data['product']['name'] == sample_product['name']
    
    def test_create_product_missing_fields(self, client, mock_db, auth_headers):
        """Test creating a product with missing required fields"""
        incomplete_product = {
            'name': 'Test Glass',
            'category': 'Test'
            # Missing description, basePrice, specifications
        }
        
        response = client.post('/api/products', json=incomplete_product, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing required fields' in response_data['error']
    
    def test_create_product_unauthorized(self, client, mock_db, sample_product):
        """Test creating a product without authentication"""
        response = client.post('/api/products', json=sample_product)
        
        assert response.status_code == 401
    
    def test_get_products_database_error(self, client, mock_db):
        """Test handling database errors when getting products"""
        mock_db.products.find_all_products.side_effect = Exception("Database error")
        
        response = client.get('/api/products')
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to get products' in response_data['error']
    
    def test_create_product_database_error(self, client, mock_db, auth_headers, sample_product):
        """Test handling database errors when creating products"""
        mock_db.products.create_product.side_effect = Exception("Database error")
        
        response = client.post('/api/products', json=sample_product, headers=auth_headers)
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to create product' in response_data['error']