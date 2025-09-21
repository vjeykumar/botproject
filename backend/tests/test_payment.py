import pytest
import json
from unittest.mock import patch

class TestPayment:
    """Test cases for payment endpoints"""
    
    def test_process_payment_success(self, client, mock_db, auth_headers):
        """Test successful payment processing"""
        payment_data = {
            'payment_method': 'Credit Card',
            'amount': 150.50,
            'card_details': {
                'card_number': '4111111111111111',
                'expiry_date': '12/25',
                'cvv': '123',
                'card_name': 'John Doe'
            }
        }
        
        response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert response_data['status'] == 'success'
        assert 'payment_id' in response_data
        assert response_data['amount'] == payment_data['amount']
        assert response_data['payment_method'] == payment_data['payment_method']
        assert 'message' in response_data
    
    def test_process_payment_upi(self, client, mock_db, auth_headers):
        """Test UPI payment processing"""
        payment_data = {
            'payment_method': 'UPI',
            'amount': 75.25,
            'upi_id': 'user@paytm'
        }
        
        response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert response_data['status'] == 'success'
        assert response_data['payment_method'] == 'UPI'
        assert response_data['amount'] == 75.25
    
    def test_process_payment_netbanking(self, client, mock_db, auth_headers):
        """Test net banking payment processing"""
        payment_data = {
            'payment_method': 'Net Banking',
            'amount': 200.00,
            'bank': 'HDFC Bank'
        }
        
        response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert response_data['status'] == 'success'
        assert response_data['payment_method'] == 'Net Banking'
        assert response_data['amount'] == 200.00
    
    def test_process_payment_missing_method(self, client, mock_db, auth_headers):
        """Test payment processing with missing payment method"""
        payment_data = {
            'amount': 100.00
            # Missing payment_method
        }
        
        response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing payment details' in response_data['error']
    
    def test_process_payment_missing_amount(self, client, mock_db, auth_headers):
        """Test payment processing with missing amount"""
        payment_data = {
            'payment_method': 'Credit Card'
            # Missing amount
        }
        
        response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing payment details' in response_data['error']
    
    def test_process_payment_zero_amount(self, client, mock_db, auth_headers):
        """Test payment processing with zero amount"""
        payment_data = {
            'payment_method': 'Credit Card',
            'amount': 0
        }
        
        response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing payment details' in response_data['error']
    
    def test_process_payment_negative_amount(self, client, mock_db, auth_headers):
        """Test payment processing with negative amount"""
        payment_data = {
            'payment_method': 'Credit Card',
            'amount': -50.00
        }
        
        response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing payment details' in response_data['error']
    
    def test_process_payment_unauthorized(self, client, mock_db):
        """Test payment processing without authentication"""
        payment_data = {
            'payment_method': 'Credit Card',
            'amount': 100.00
        }
        
        response = client.post('/api/payment/process', json=payment_data)
        
        assert response.status_code == 401
    
    def test_process_payment_with_card_details(self, client, mock_db, auth_headers):
        """Test payment processing with complete card details"""
        payment_data = {
            'payment_method': 'Credit Card',
            'amount': 299.99,
            'card_details': {
                'card_number': '4532015112830366',
                'expiry_date': '08/26',
                'cvv': '456',
                'card_name': 'Jane Smith'
            }
        }
        
        response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert response_data['status'] == 'success'
        assert 'payment_id' in response_data
        assert response_data['payment_id'].startswith('pay_')
        assert len(response_data['payment_id']) == 16  # pay_ + 12 characters
    
    def test_process_payment_simulation_delay(self, client, mock_db, auth_headers):
        """Test that payment processing includes simulation delay"""
        import time
        
        payment_data = {
            'payment_method': 'UPI',
            'amount': 50.00,
            'upi_id': 'test@upi'
        }
        
        start_time = time.time()
        response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        end_time = time.time()
        
        # Should take at least 2 seconds due to simulation delay
        assert (end_time - start_time) >= 2.0
        assert response.status_code == 200
    
    def test_process_payment_generates_unique_id(self, client, mock_db, auth_headers):
        """Test that each payment generates a unique payment ID"""
        payment_data = {
            'payment_method': 'Credit Card',
            'amount': 100.00
        }
        
        # Make two payment requests
        response1 = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        response2 = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        
        data1 = response1.get_json()
        data2 = response2.get_json()
        
        # Payment IDs should be different
        assert data1['payment_id'] != data2['payment_id']
        assert data1['payment_id'].startswith('pay_')
        assert data2['payment_id'].startswith('pay_')
    
    def test_process_payment_error_handling(self, client, mock_db, auth_headers):
        """Test payment processing error handling"""
        with patch('time.sleep', side_effect=Exception("Payment gateway error")):
            payment_data = {
                'payment_method': 'Credit Card',
                'amount': 100.00
            }
            
            response = client.post('/api/payment/process', json=payment_data, headers=auth_headers)
            
            assert response.status_code == 500
            response_data = response.get_json()
            assert 'error' in response_data
            assert 'Payment processing failed' in response_data['error']