#!/usr/bin/env python3
"""
Simple test to verify the complete purchase flow
"""

import sys
import os
import json
from datetime import datetime

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import app
    from database.mongodb import db
    print("✅ Imports successful")
except Exception as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

def test_purchase_flow():
    """Test the complete purchase flow"""
    
    with app.test_client() as client:
        print("\n🧪 Testing Complete Purchase Flow")
        print("=" * 50)
        
        # Step 1: Register user
        print("1️⃣ Testing user registration...")
        register_data = {
            'name': 'Test Purchase User',
            'email': 'purchase@test.com',
            'password': 'password123'
        }
        
        try:
            response = client.post('/api/register', 
                                 json=register_data,
                                 content_type='application/json')
            print(f"   Status: {response.status_code}")
            
            if response.status_code != 201:
                print(f"   ❌ Registration failed: {response.get_json()}")
                return False
            
            auth_data = response.get_json()
            token = auth_data.get('access_token')
            if not token:
                print("   ❌ No access token received")
                return False
            
            print("   ✅ Registration successful")
            
        except Exception as e:
            print(f"   ❌ Registration error: {e}")
            return False
        
        # Step 2: Test order creation
        print("2️⃣ Testing order creation...")
        
        auth_headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        order_data = {
            'items': [
                {
                    'id': 'test-item-1',
                    'name': 'Test Glass Product',
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
            print(f"   Status: {response.status_code}")
            
            if response.status_code != 201:
                error_data = response.get_json()
                print(f"   ❌ Order creation failed: {error_data}")
                return False
            
            order_result = response.get_json()
            print(f"   ✅ Order created: {order_result.get('order', {}).get('order_number', 'Unknown')}")
            
        except Exception as e:
            print(f"   ❌ Order creation error: {e}")
            return False
        
        # Step 3: Test payment processing
        print("3️⃣ Testing payment processing...")
        
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
            response = client.post('/api/payment/process',
                                 json=payment_data,
                                 headers=auth_headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code != 200:
                error_data = response.get_json()
                print(f"   ❌ Payment failed: {error_data}")
                return False
            
            payment_result = response.get_json()
            print(f"   ✅ Payment successful: {payment_result.get('payment_id', 'Unknown')}")
            
        except Exception as e:
            print(f"   ❌ Payment error: {e}")
            return False
        
        print("\n🎉 All tests passed! Purchase flow is working correctly.")
        return True

if __name__ == '__main__':
    success = test_purchase_flow()
    if not success:
        print("\n❌ Purchase flow test failed!")
        sys.exit(1)
    else:
        print("\n✅ Purchase flow test completed successfully!")