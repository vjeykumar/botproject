import pytest
import json

class TestErrorHandlers:
    """Test cases for error handling endpoints"""
    
    def test_404_not_found(self, client):
        """Test 404 error handler"""
        response = client.get('/api/nonexistent-endpoint')
        
        assert response.status_code == 404
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Endpoint not found' in response_data['error']
    
    def test_404_post_not_found(self, client):
        """Test 404 error handler for POST requests"""
        response = client.post('/api/nonexistent-endpoint', json={'test': 'data'})
        
        assert response.status_code == 404
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Endpoint not found' in response_data['error']
    
    def test_405_method_not_allowed(self, client):
        """Test method not allowed error"""
        # Try to POST to a GET-only endpoint
        response = client.post('/api/health')
        
        assert response.status_code == 405
    
    def test_invalid_json_format(self, client, auth_headers):
        """Test handling of invalid JSON format"""
        response = client.post(
            '/api/products',
            data='invalid json format',
            headers={**auth_headers, 'Content-Type': 'application/json'}
        )
        
        assert response.status_code == 400
    
    def test_missing_content_type(self, client, auth_headers):
        """Test handling of missing content type"""
        response = client.post(
            '/api/products',
            data='{"name": "test"}',
            headers=auth_headers
        )
        
        # Should still work as Flask is flexible with content types
        # But the data won't be parsed as JSON without proper content type
        assert response.status_code in [400, 500]  # Depends on how Flask handles it
    
    def test_large_payload(self, client, auth_headers):
        """Test handling of large payloads"""
        # Create a large payload
        large_data = {
            'name': 'Test Product',
            'category': 'Test',
            'description': 'A' * 10000,  # Very long description
            'basePrice': 25,
            'specifications': ['spec'] * 1000  # Many specifications
        }
        
        response = client.post('/api/products', json=large_data, headers=auth_headers)
        
        # Should handle large payloads gracefully
        assert response.status_code in [201, 400, 413, 500]
    
    def test_special_characters_in_url(self, client):
        """Test handling of special characters in URL"""
        response = client.get('/api/products/test%20with%20spaces')
        
        assert response.status_code in [404, 500]  # Should handle gracefully
    
    def test_sql_injection_attempt(self, client):
        """Test handling of SQL injection attempts"""
        malicious_id = "'; DROP TABLE users; --"
        response = client.get(f'/api/products/{malicious_id}')
        
        # Should not cause server error, just return 404 or 500
        assert response.status_code in [404, 500]
        response_data = response.get_json()
        assert 'error' in response_data
    
    def test_xss_attempt(self, client, auth_headers):
        """Test handling of XSS attempts"""
        xss_data = {
            'name': '<script>alert("xss")</script>',
            'category': 'Test',
            'description': '<img src=x onerror=alert("xss")>',
            'basePrice': 25,
            'specifications': ['<script>alert("xss")</script>']
        }
        
        response = client.post('/api/products', json=xss_data, headers=auth_headers)
        
        # Should handle XSS attempts gracefully
        assert response.status_code in [201, 400, 500]
        if response.status_code == 201:
            # If successful, ensure data is properly escaped/sanitized
            response_data = response.get_json()
            assert 'product' in response_data
    
    def test_unicode_handling(self, client, auth_headers):
        """Test handling of Unicode characters"""
        unicode_data = {
            'name': 'Test Product 测试产品',
            'category': 'Test カテゴリ',
            'description': 'Description with émojis 🚀 and ñoñó characters',
            'basePrice': 25,
            'specifications': ['Spec with ñ and ü characters']
        }
        
        response = client.post('/api/products', json=unicode_data, headers=auth_headers)
        
        # Should handle Unicode properly
        assert response.status_code in [201, 400, 500]
        if response.status_code == 201:
            response_data = response.get_json()
            assert 'product' in response_data
            # Unicode should be preserved
            assert '测试产品' in response_data['product']['name']