import pytest
from unittest.mock import Mock, patch, MagicMock
from bson import ObjectId
from datetime import datetime

# Import database classes for testing
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

class TestDatabaseOperations:
    """Test cases for database operations"""
    
    @patch('database.mongodb.MongoClient')
    def test_mongodb_connection_success(self, mock_client):
        """Test successful MongoDB connection"""
        from database.mongodb import MongoDB
        
        # Mock successful connection
        mock_client.return_value.admin.command.return_value = {'ok': 1}
        mock_client.return_value.__getitem__.return_value = Mock()
        
        db = MongoDB()
        
        assert db.client is not None
        assert db.db is not None
        mock_client.assert_called_once()
    
    @patch('database.mongodb.MongoClient')
    def test_mongodb_connection_failure(self, mock_client):
        """Test MongoDB connection failure"""
        from database.mongodb import MongoDB
        
        # Mock connection failure
        mock_client.side_effect = Exception("Connection failed")
        
        with pytest.raises(Exception):
            MongoDB()
    
    def test_user_operations_create_user(self):
        """Test user creation operation"""
        from database.mongodb import UserOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.users = mock_collection
        
        user_ops = UserOperations(mock_db)
        
        # Mock successful insertion
        mock_collection.insert_one.return_value.inserted_id = ObjectId()
        
        user_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'password_hash': 'hashed_password'
        }
        
        result = user_ops.create_user(user_data)
        
        assert 'id' in result
        assert 'created_at' in result
        assert result['name'] == 'Test User'
        assert result['email'] == 'test@example.com'
        mock_collection.insert_one.assert_called_once()
    
    def test_user_operations_find_by_email(self):
        """Test finding user by email"""
        from database.mongodb import UserOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.users = mock_collection
        
        user_ops = UserOperations(mock_db)
        
        # Mock user found
        mock_user = {
            '_id': ObjectId(),
            'name': 'Test User',
            'email': 'test@example.com',
            'password_hash': 'hashed_password'
        }
        mock_collection.find_one.return_value = mock_user
        
        result = user_ops.find_user_by_email('test@example.com')
        
        assert result is not None
        assert 'id' in result
        assert '_id' not in result
        assert result['email'] == 'test@example.com'
        mock_collection.find_one.assert_called_once_with({'email': 'test@example.com'})
    
    def test_user_operations_find_by_email_not_found(self):
        """Test finding user by email when not found"""
        from database.mongodb import UserOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.users = mock_collection
        
        user_ops = UserOperations(mock_db)
        
        # Mock user not found
        mock_collection.find_one.return_value = None
        
        result = user_ops.find_user_by_email('nonexistent@example.com')
        
        assert result is None
        mock_collection.find_one.assert_called_once()
    
    def test_product_operations_create_product(self):
        """Test product creation operation"""
        from database.mongodb import ProductOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.products = mock_collection
        
        product_ops = ProductOperations(mock_db)
        
        # Mock successful insertion
        mock_collection.insert_one.return_value.inserted_id = ObjectId()
        
        product_data = {
            'name': 'Test Glass',
            'category': 'Test',
            'description': 'Test product',
            'basePrice': 25,
            'specifications': ['Test spec']
        }
        
        result = product_ops.create_product(product_data)
        
        assert 'id' in result
        assert 'created_at' in result
        assert result['name'] == 'Test Glass'
        mock_collection.insert_one.assert_called_once()
    
    def test_product_operations_find_all(self):
        """Test finding all products"""
        from database.mongodb import ProductOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.products = mock_collection
        
        product_ops = ProductOperations(mock_db)
        
        # Mock products found
        mock_products = [
            {
                '_id': ObjectId(),
                'name': 'Product 1',
                'category': 'Category 1'
            },
            {
                '_id': ObjectId(),
                'name': 'Product 2',
                'category': 'Category 2'
            }
        ]
        mock_collection.find.return_value.sort.return_value = mock_products
        
        result = product_ops.find_all_products()
        
        assert len(result) == 2
        assert all('id' in product for product in result)
        assert all('_id' not in product for product in result)
        mock_collection.find.assert_called_once()
    
    def test_order_operations_create_order(self):
        """Test order creation operation"""
        from database.mongodb import OrderOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.orders = mock_collection
        
        order_ops = OrderOperations(mock_db)
        
        # Mock successful insertion
        mock_collection.insert_one.return_value.inserted_id = ObjectId()
        mock_collection.find_one.return_value = None  # For order number uniqueness check
        
        order_data = {
            'user_id': 'user123',
            'total_amount': 100.0,
            'payment_method': 'Credit Card',
            'billing_info': {
                'email': 'test@example.com',
                'phone': '1234567890',
                'address': '123 Test St',
                'city': 'Test City',
                'state': 'Test State',
                'pincode': '12345'
            },
            'items': [
                {
                    'id': 'item1',
                    'name': 'Test Item',
                    'price': 100.0,
                    'quantity': 1
                }
            ]
        }
        
        result = order_ops.create_order(order_data)
        
        assert 'id' in result
        assert 'order_number' in result
        assert 'created_at' in result
        assert result['total_amount'] == 100.0
        mock_collection.insert_one.assert_called_once()
    
    def test_order_operations_generate_order_number(self):
        """Test order number generation"""
        from database.mongodb import OrderOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.orders = mock_collection
        
        order_ops = OrderOperations(mock_db)
        
        # Mock no existing order with same number
        mock_collection.find_one.return_value = None
        
        order_number = order_ops._generate_order_number()
        
        assert order_number.startswith('EG')
        assert len(order_number) >= 10  # EG + date + unique part
    
    def test_cart_operations_add_item(self):
        """Test adding item to cart"""
        from database.mongodb import CartOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.carts = mock_collection
        
        cart_ops = CartOperations(mock_db)
        
        # Mock existing cart
        mock_collection.find_one.return_value = {
            '_id': ObjectId(),
            'user_id': 'user123',
            'items': []
        }
        
        # Mock successful update
        mock_collection.update_one.return_value.modified_count = 1
        
        item_data = {
            'id': 'item123',
            'name': 'Test Item',
            'price': 50.0,
            'quantity': 1
        }
        
        result = cart_ops.add_item_to_cart('user123', item_data)
        
        assert result is True
        mock_collection.update_one.assert_called_once()
    
    def test_cart_operations_clear_cart(self):
        """Test clearing cart"""
        from database.mongodb import CartOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.carts = mock_collection
        
        cart_ops = CartOperations(mock_db)
        
        # Mock existing cart
        mock_collection.find_one.return_value = {
            '_id': ObjectId(),
            'user_id': 'user123',
            'items': [{'id': 'item1'}]
        }
        
        # Mock successful update
        mock_collection.update_one.return_value.modified_count = 1
        
        result = cart_ops.clear_cart('user123')
        
        assert result is True
        mock_collection.update_one.assert_called_once()
    
    def test_review_operations_create_review(self):
        """Test review creation operation"""
        from database.mongodb import ReviewOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.reviews = mock_collection
        
        review_ops = ReviewOperations(mock_db)
        
        # Mock successful insertion
        mock_collection.insert_one.return_value.inserted_id = ObjectId()
        
        review_data = {
            'user_id': 'user123',
            'product_id': 'product123',
            'rating': 5,
            'comment': 'Great product!'
        }
        
        result = review_ops.create_review(review_data)
        
        assert 'id' in result
        assert 'created_at' in result
        assert result['rating'] == 5
        mock_collection.insert_one.assert_called_once()
    
    def test_review_operations_get_rating_stats(self):
        """Test getting rating statistics"""
        from database.mongodb import ReviewOperations
        
        mock_db = Mock()
        mock_collection = Mock()
        mock_db.reviews = mock_collection
        
        review_ops = ReviewOperations(mock_db)
        
        # Mock aggregation result
        mock_collection.aggregate.return_value = [
            {
                '_id': None,
                'average_rating': 4.5,
                'total_reviews': 10,
                'rating_distribution': [5, 5, 4, 4, 4, 3, 3, 2, 1, 1]
            }
        ]
        
        result = review_ops.get_product_rating_stats('product123')
        
        assert result['average_rating'] == 4.5
        assert result['total_reviews'] == 10
        assert len(result['rating_distribution']) == 5
        mock_collection.aggregate.assert_called_once()
    
    def test_database_stats(self):
        """Test getting database statistics"""
        from database.mongodb import EdgecraftDB
        
        with patch('database.mongodb.MongoDB') as mock_mongodb:
            mock_db_instance = Mock()
            mock_mongodb.return_value.db = mock_db_instance
            
            # Mock collection counts
            mock_db_instance.users.count_documents.return_value = 5
            mock_db_instance.products.count_documents.return_value = 10
            mock_db_instance.orders.count_documents.return_value = 3
            mock_db_instance.reviews.count_documents.return_value = 8
            mock_db_instance.carts.count_documents.return_value = 2
            mock_db_instance.name = 'test_db'
            mock_db_instance.list_collection_names.return_value = ['users', 'products', 'orders', 'reviews', 'carts']
            
            db = EdgecraftDB()
            stats = db.get_db_stats()
            
            assert stats['users_count'] == 5
            assert stats['products_count'] == 10
            assert stats['orders_count'] == 3
            assert stats['reviews_count'] == 8
            assert stats['carts_count'] == 2
            assert stats['database_name'] == 'test_db'
            assert len(stats['collections']) == 5