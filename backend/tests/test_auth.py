import pytest
import json
from unittest.mock import patch
from werkzeug.security import generate_password_hash

class TestAuthentication:
    """Test cases for authentication endpoints"""
    
    def test_register_success(self, client, mock_db):
        """Test successful user registration"""
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123'
        }
        
        response = client.post('/api/register', json=data)
        
        assert response.status_code == 201
        response_data = response.get_json()
        assert 'access_token' in response_data
        assert 'user' in response_data
        assert response_data['user']['email'] == data['email']
        assert response_data['user']['name'] == data['name']
        assert 'password_hash' not in response_data['user']
    
    def test_register_missing_fields(self, client, mock_db):
        """Test registration with missing required fields"""
        data = {
            'name': 'John Doe',
            'email': 'john@example.com'
            # Missing password
        }
        
        response = client.post('/api/register', json=data)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing required fields' in response_data['error']
    
    def test_register_duplicate_email(self, client, mock_db):
        """Test registration with existing email"""
        # Mock existing user
        mock_db.users.find_user_by_email.return_value = {
            'id': '507f1f77bcf86cd799439011',
            'email': 'existing@example.com',
            'password_hash': generate_password_hash('password123')
        }
        
        data = {
            'name': 'John Doe',
            'email': 'existing@example.com',
            'password': 'password123'
        }
        
        response = client.post('/api/register', json=data)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Email already registered' in response_data['error']
    
    def test_login_success(self, client, mock_db):
        """Test successful login"""
        data = {
            'email': 'test@example.com',
            'password': 'password123'
        }
        
        with patch('app.check_password', return_value=True):
            response = client.post('/api/login', json=data)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'access_token' in response_data
        assert 'user' in response_data
        assert response_data['user']['email'] == data['email']
        assert 'password_hash' not in response_data['user']
    
    def test_login_invalid_credentials(self, client, mock_db):
        """Test login with invalid credentials"""
        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        
        with patch('app.check_password', return_value=False):
            response = client.post('/api/login', json=data)
        
        assert response.status_code == 401
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Invalid credentials' in response_data['error']
    
    def test_login_missing_fields(self, client, mock_db):
        """Test login with missing fields"""
        data = {
            'email': 'test@example.com'
            # Missing password
        }
        
        response = client.post('/api/login', json=data)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing email or password' in response_data['error']
    
    def test_login_nonexistent_user(self, client, mock_db):
        """Test login with non-existent user"""
        mock_db.users.find_user_by_email.return_value = None
        
        data = {
            'email': 'nonexistent@example.com',
            'password': 'password123'
        }
        
        response = client.post('/api/login', json=data)
        
        assert response.status_code == 401
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Invalid credentials' in response_data['error']
    
    def test_get_profile_success(self, client, mock_db, auth_headers):
        """Test getting user profile with valid token"""
        response = client.get('/api/profile', headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'user' in response_data
        assert 'password_hash' not in response_data['user']
    
    def test_get_profile_no_token(self, client, mock_db):
        """Test getting user profile without token"""
        response = client.get('/api/profile')
        
        assert response.status_code == 401
    
    def test_get_profile_invalid_token(self, client, mock_db):
        """Test getting user profile with invalid token"""
        headers = {'Authorization': 'Bearer invalid_token'}
        response = client.get('/api/profile', headers=headers)
        
        assert response.status_code == 422  # JWT decode error
    
    def test_admin_role_assignment(self, client, mock_db):
        """Test admin role assignment for admin emails"""
        mock_db.users.find_user_by_email.return_value = {
            'id': '507f1f77bcf86cd799439011',
            'name': 'Admin User',
            'email': 'admin@edgecraftglass.com',
            'password_hash': generate_password_hash('admin123'),
            'created_at': '2025-01-01T00:00:00'
        }
        
        data = {
            'email': 'admin@edgecraftglass.com',
            'password': 'password123'
        }
        
        with patch('app.check_password', return_value=True):
            response = client.post('/api/login', json=data)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert response_data['user']['role'] == 'admin'