import pytest
import json
from unittest.mock import patch

class TestHealth:
    """Test cases for health check and system endpoints"""
    
    def test_health_check_success(self, client, mock_db):
        """Test successful health check"""
        response = client.get('/api/health')
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert response_data['status'] == 'healthy'
        assert 'timestamp' in response_data
        assert response_data['database'] == 'connected'
        assert 'stats' in response_data
    
    def test_health_check_database_error(self, client, mock_db):
        """Test health check with database error"""
        mock_db.get_db_stats.side_effect = Exception("Database connection failed")
        
        response = client.get('/api/health')
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert response_data['status'] == 'unhealthy'
        assert response_data['database'] == 'disconnected'
        assert 'error' in response_data
        assert 'timestamp' in response_data
    
    def test_get_db_stats_success(self, client, mock_db, auth_headers):
        """Test getting database statistics"""
        response = client.get('/api/db/stats', headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'users_count' in response_data
        assert 'products_count' in response_data
        assert 'orders_count' in response_data
        assert 'reviews_count' in response_data
        assert 'database_name' in response_data
        assert 'collections' in response_data
    
    def test_get_db_stats_unauthorized(self, client, mock_db):
        """Test getting database statistics without authentication"""
        response = client.get('/api/db/stats')
        
        assert response.status_code == 401
    
    def test_get_db_stats_database_error(self, client, mock_db, auth_headers):
        """Test getting database statistics with database error"""
        mock_db.get_db_stats.side_effect = Exception("Database error")
        
        response = client.get('/api/db/stats', headers=auth_headers)
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to get database stats' in response_data['error']
    
    def test_health_check_response_format(self, client, mock_db):
        """Test health check response format"""
        response = client.get('/api/health')
        
        assert response.status_code == 200
        response_data = response.get_json()
        
        # Check required fields
        required_fields = ['status', 'timestamp', 'database']
        for field in required_fields:
            assert field in response_data
        
        # Check timestamp format (ISO format)
        timestamp = response_data['timestamp']
        assert 'T' in timestamp  # ISO format contains 'T'
        assert timestamp.endswith('Z') or '+' in timestamp or '-' in timestamp[-6:]
    
    def test_db_stats_response_format(self, client, mock_db, auth_headers):
        """Test database stats response format"""
        response = client.get('/api/db/stats', headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        
        # Check required fields
        required_fields = [
            'users_count', 'products_count', 'orders_count', 
            'reviews_count', 'database_name', 'collections'
        ]
        for field in required_fields:
            assert field in response_data
        
        # Check data types
        assert isinstance(response_data['users_count'], int)
        assert isinstance(response_data['products_count'], int)
        assert isinstance(response_data['orders_count'], int)
        assert isinstance(response_data['reviews_count'], int)
        assert isinstance(response_data['database_name'], str)
        assert isinstance(response_data['collections'], list)