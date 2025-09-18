from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
from bson import ObjectId
from datetime import datetime
import os
import uuid
import time
from typing import Dict, List, Optional, Any

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None
        self.connect()
    
    def connect(self):
        """Connect to MongoDB"""
        try:
            # MongoDB connection string - compatible with MongoDB Compass
            mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
            db_name = os.getenv('MONGODB_DB_NAME', 'edgecraft_glass')
            
            self.client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            self.db = self.client[db_name]
            
            # Test connection
            try:
                self.client.admin.command('ping')
            except Exception as ping_error:
                print(f"⚠️ MongoDB ping failed: {ping_error}")
                # Continue without database for testing
                return
                
            print(f"✅ Connected to MongoDB: {db_name}")
            
            # Create indexes
            self._create_indexes()
            
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            self.client = None
            self.db = None
            raise Exception(f"Failed to connect to MongoDB: {str(e)}")

    def _create_indexes(self):
        """Create database indexes for better performance"""
        try:
            # Users collection indexes
            self.db.users.create_index("email", unique=True)
            self.db.users.create_index("created_at")
            
            # Products collection indexes
            self.db.products.create_index("category")
            self.db.products.create_index("name")
            self.db.products.create_index("created_at")
            
            # Carts collection indexes
            self.db.carts.create_index("user_id", unique=True)
            self.db.carts.create_index("updated_at")
            
            # Orders collection indexes
            self.db.orders.create_index("order_number", unique=True)
            self.db.orders.create_index("user_id")
            self.db.orders.create_index("created_at")
            self.db.orders.create_index("status")
            
            # Reviews collection indexes
            self.db.reviews.create_index([("product_id", 1), ("user_id", 1)])
            self.db.reviews.create_index("created_at")
            
            print("✅ Database indexes created successfully")
            
        except Exception as e:
            print(f"⚠️ Index creation warning: {e}")
    
    def close_connection(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            print("🔌 MongoDB connection closed")

# User Operations
class UserOperations:
    def __init__(self, db):
        self.collection = db.users
    
    def create_user(self, user_data: Dict) -> Dict:
        """Create a new user"""
        try:
            user_data['created_at'] = datetime.utcnow()
            user_data['_id'] = ObjectId()
            
            result = self.collection.insert_one(user_data)
            user_data['id'] = str(result.inserted_id)
            del user_data['_id']
            
            return user_data
            
        except DuplicateKeyError:
            raise ValueError("Email already exists")
        except Exception as e:
            raise Exception(f"Failed to create user: {e}")
    
    def find_user_by_email(self, email: str) -> Optional[Dict]:
        """Find user by email"""
        try:
            user = self.collection.find_one({"email": email})
            if user:
                user['id'] = str(user['_id'])
                del user['_id']
            return user
        except Exception as e:
            raise Exception(f"Failed to find user: {e}")
    
    def find_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Find user by ID"""
        try:
            user = self.collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user['id'] = str(user['_id'])
                del user['_id']
            return user
        except Exception as e:
            raise Exception(f"Failed to find user: {e}")
    
    def update_user(self, user_id: str, update_data: Dict) -> bool:
        """Update user information"""
        try:
            update_data['updated_at'] = datetime.utcnow()
            result = self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            raise Exception(f"Failed to update user: {e}")

# Order Operations
class OrderOperations:
    def __init__(self, db):
        self.collection = db.orders
    
    def create_order(self, order_data: Dict) -> Dict:
        """Create a new order"""
        try:
            print(f"📦 Creating order in database with data: {order_data}")
            
            # Validate required fields
            required_fields = ['user_id', 'total_amount', 'payment_method', 'billing_info', 'items']
            for field in required_fields:
                if field not in order_data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Ensure items is a list
            if not isinstance(order_data['items'], list):
                raise ValueError("Items must be a list")
            
            # Set timestamps
            order_data['created_at'] = datetime.utcnow()
            order_data['updated_at'] = datetime.utcnow()
            order_data['_id'] = ObjectId()
            
            # Generate order number if not provided
            if 'order_number' not in order_data:
                order_data['order_number'] = self._generate_order_number()
            
            print(f"📦 Inserting order with order_number: {order_data['order_number']}")
            result = self.collection.insert_one(order_data)
            
            if not result.inserted_id:
                raise Exception("Failed to insert order into database")
            
            order_data['id'] = str(result.inserted_id)
            del order_data['_id']
            
            print(f"✅ Order created successfully with ID: {order_data['id']}")
            return order_data
            
        except ValueError as e:
            print(f"❌ Validation error in create_order: {e}")
            raise e
        except Exception as e:
            print(f"💥 Database error in create_order: {e}")
            import traceback
            traceback.print_exc()
            raise Exception(f"Database error: {str(e)}")
    
    def find_orders_by_user(self, user_id: str) -> List[Dict]:
        """Find all orders for a user"""
        try:
            orders = list(self.collection.find(
                {"user_id": user_id}
            ).sort("created_at", -1))
            
            for order in orders:
                order['id'] = str(order['_id'])
                del order['_id']
            
            return orders
        except Exception as e:
            raise Exception(f"Failed to find orders: {e}")
    
    def find_order_by_id(self, order_id: str, user_id: str = None) -> Optional[Dict]:
        """Find order by ID"""
        try:
            query = {"_id": ObjectId(order_id)}
            if user_id:
                query["user_id"] = user_id
            
            order = self.collection.find_one(query)
            if order:
                order['id'] = str(order['_id'])
                del order['_id']
            
            return order
        except Exception as e:
            raise Exception(f"Failed to find order: {e}")
    
    def update_order_status(self, order_id: str, status: str) -> bool:
        """Update order status"""
        try:
            result = self.collection.update_one(
                {"_id": ObjectId(order_id)},
                {"$set": {"status": status, "updated_at": datetime.utcnow()}}
            )
            return result.modified_count > 0
        except Exception as e:
            raise Exception(f"Failed to update order: {e}")
    
    def _generate_order_number(self) -> str:
        """Generate unique order number"""
        try:
            import uuid
            timestamp = datetime.utcnow().strftime('%Y%m%d')
            unique_id = str(uuid.uuid4())[:6].upper()
            order_number = f"EG{timestamp}{unique_id}"
            
            # Ensure uniqueness by checking if order number already exists
            existing = self.collection.find_one({"order_number": order_number})
            if existing:
                # If exists, add more randomness
                unique_id = str(uuid.uuid4())[:8].upper()
                order_number = f"EG{timestamp}{unique_id}"
            
            print(f"📦 Generated order number: {order_number}")
            return order_number
            
        except Exception as e:
            print(f"💥 Error generating order number: {e}")
            # Fallback to timestamp-based number
            import time
            return f"EG{int(time.time())}"

class ProductOperations:
    def __init__(self, db):
        self.collection = db.products
    
    def create_product(self, product_data: Dict) -> Dict:
        """Create a new product"""
        try:
            product_data['created_at'] = datetime.utcnow()
            product_data['_id'] = ObjectId()
            
            result = self.collection.insert_one(product_data)
            product_data['id'] = str(result.inserted_id)
            del product_data['_id']
            
            return product_data
            
        except Exception as e:
            raise Exception(f"Failed to create product: {e}")
    
    def find_all_products(self) -> List[Dict]:
        """Find all products"""
        try:
            products = list(self.collection.find().sort("created_at", -1))
            
            for product in products:
                product['id'] = str(product['_id'])
                del product['_id']
            
            return products
        except Exception as e:
            raise Exception(f"Failed to find products: {e}")
    
    def find_product_by_id(self, product_id: str) -> Optional[Dict]:
        """Find product by ID"""
        try:
            product = self.collection.find_one({"_id": ObjectId(product_id)})
            if product:
                product['id'] = str(product['_id'])
                del product['_id']
            return product
        except Exception as e:
            raise Exception(f"Failed to find product: {e}")
    
    def find_products_by_category(self, category: str) -> List[Dict]:
        """Find products by category"""
        try:
            products = list(self.collection.find(
                {"category": category}
            ).sort("created_at", -1))
            
            for product in products:
                product['id'] = str(product['_id'])
                del product['_id']
            
            return products
        except Exception as e:
            raise Exception(f"Failed to find products by category: {e}")
    
    def update_product(self, product_id: str, update_data: Dict) -> bool:
        """Update product information"""
        try:
            update_data['updated_at'] = datetime.utcnow()
            result = self.collection.update_one(
                {"_id": ObjectId(product_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            raise Exception(f"Failed to update product: {e}")
    
    def delete_product(self, product_id: str) -> bool:
        """Delete product"""
        try:
            result = self.collection.delete_one({"_id": ObjectId(product_id)})
            return result.deleted_count > 0
        except Exception as e:
            raise Exception(f"Failed to delete product: {e}")

# Cart Operations
class CartOperations:
    def __init__(self, db):
        self.collection = db.carts
    
    def create_cart(self, user_id: str) -> Dict:
        """Create a new cart for user"""
        try:
            cart_data = {
                'user_id': user_id,
                'items': [],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                '_id': ObjectId()
            }
            
            result = self.collection.insert_one(cart_data)
            cart_data['id'] = str(result.inserted_id)
            del cart_data['_id']
            
            return cart_data
            
        except Exception as e:
            raise Exception(f"Failed to create cart: {e}")
    
    def find_cart_by_user(self, user_id: str) -> Optional[Dict]:
        """Find cart by user ID"""
        try:
            cart = self.collection.find_one({"user_id": user_id})
            if cart:
                cart['id'] = str(cart['_id'])
                del cart['_id']
            return cart
        except Exception as e:
            raise Exception(f"Failed to find cart: {e}")
    
    def add_item_to_cart(self, user_id: str, item_data: Dict) -> bool:
        """Add item to cart"""
        try:
            # Find existing cart or create new one
            cart = self.find_cart_by_user(user_id)
            if not cart:
                cart = self.create_cart(user_id)
            
            # Add item to cart
            result = self.collection.update_one(
                {"user_id": user_id},
                {
                    "$push": {"items": item_data},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            return result.modified_count > 0
        except Exception as e:
            raise Exception(f"Failed to add item to cart: {e}")
    
    def update_cart_item(self, user_id: str, item_id: str, update_data: Dict) -> bool:
        """Update cart item"""
        try:
            result = self.collection.update_one(
                {"user_id": user_id, "items.id": item_id},
                {
                    "$set": {
                        "items.$.quantity": update_data.get('quantity'),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            raise Exception(f"Failed to update cart item: {e}")
    
    def remove_item_from_cart(self, user_id: str, item_id: str) -> bool:
        """Remove item from cart"""
        try:
            result = self.collection.update_one(
                {"user_id": user_id},
                {
                    "$pull": {"items": {"id": item_id}},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            return result.modified_count > 0
        except Exception as e:
            raise Exception(f"Failed to remove item from cart: {e}")
    
    def clear_cart(self, user_id: str) -> bool:
        """Clear all items from cart"""
        try:
            print(f"🛒 Clearing cart for user: {user_id}")
            
            # Check if cart exists first
            cart = self.find_cart_by_user(user_id)
            if not cart:
                print(f"⚠️ No cart found for user {user_id}, creating empty cart")
                self.create_cart(user_id)
                return True
            
            result = self.collection.update_one(
                {"user_id": user_id},
                {
                    "$set": {
                        "items": [],
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            success = result.modified_count > 0 or result.matched_count > 0
            print(f"🛒 Cart clear result - matched: {result.matched_count}, modified: {result.modified_count}")
            return success
            
        except Exception as e:
            print(f"💥 Error clearing cart: {e}")
            raise Exception(f"Failed to clear cart: {str(e)}")

# Review Operations
class ReviewOperations:
    def __init__(self, db):
        self.collection = db.reviews
    
    def create_review(self, review_data: Dict) -> Dict:
        """Create a new review"""
        try:
            review_data['created_at'] = datetime.utcnow()
            review_data['_id'] = ObjectId()
            
            result = self.collection.insert_one(review_data)
            review_data['id'] = str(result.inserted_id)
            del review_data['_id']
            
            return review_data
            
        except Exception as e:
            raise Exception(f"Failed to create review: {e}")
    
    def find_reviews_by_product(self, product_id: str) -> List[Dict]:
        """Find all reviews for a product"""
        try:
            # Aggregate reviews with user information
            pipeline = [
                {"$match": {"product_id": product_id}},
                {"$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user_info"
                }},
                {"$unwind": "$user_info"},
                {"$project": {
                    "product_id": 1,
                    "rating": 1,
                    "comment": 1,
                    "created_at": 1,
                    "user_name": "$user_info.name"
                }},
                {"$sort": {"created_at": -1}}
            ]
            
            reviews = list(self.collection.aggregate(pipeline))
            
            for review in reviews:
                review['id'] = str(review['_id'])
                del review['_id']
            
            return reviews
        except Exception as e:
            raise Exception(f"Failed to find reviews: {e}")
    
    def get_product_rating_stats(self, product_id: str) -> Dict:
        """Get rating statistics for a product"""
        try:
            pipeline = [
                {"$match": {"product_id": product_id}},
                {"$group": {
                    "_id": None,
                    "average_rating": {"$avg": "$rating"},
                    "total_reviews": {"$sum": 1},
                    "rating_distribution": {
                        "$push": "$rating"
                    }
                }}
            ]
            
            result = list(self.collection.aggregate(pipeline))
            
            if result:
                stats = result[0]
                # Calculate rating distribution
                distribution = [0, 0, 0, 0, 0]
                for rating in stats['rating_distribution']:
                    distribution[rating - 1] += 1
                
                return {
                    'average_rating': round(stats['average_rating'], 1),
                    'total_reviews': stats['total_reviews'],
                    'rating_distribution': distribution
                }
            
            return {
                'average_rating': 0.0,
                'total_reviews': 0,
                'rating_distribution': [0, 0, 0, 0, 0]
            }
            
        except Exception as e:
            raise Exception(f"Failed to get rating stats: {e}")

# Main Database Class
class EdgecraftDB:
    def __init__(self):
        self.mongodb = MongoDB()
        self.users = UserOperations(self.mongodb.db)
        self.products = ProductOperations(self.mongodb.db)
        self.carts = CartOperations(self.mongodb.db)
        self.orders = OrderOperations(self.mongodb.db)
        self.reviews = ReviewOperations(self.mongodb.db)
    
    def close(self):
        """Close database connection"""
        self.mongodb.close_connection()
    
    def get_db_stats(self) -> Dict:
        """Get database statistics"""
        try:
            stats = {
                'users_count': self.mongodb.db.users.count_documents({}),
                'products_count': self.mongodb.db.products.count_documents({}),
                'carts_count': self.mongodb.db.carts.count_documents({}),
                'orders_count': self.mongodb.db.orders.count_documents({}),
                'reviews_count': self.mongodb.db.reviews.count_documents({}),
                'database_name': self.mongodb.db.name,
                'collections': self.mongodb.db.list_collection_names()
            }
            return stats
        except Exception as e:
            raise Exception(f"Failed to get database stats: {e}")

# Initialize database instance
db = EdgecraftDB()
