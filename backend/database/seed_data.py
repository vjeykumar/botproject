"""
Seed data for MongoDB collections
"""

from datetime import datetime
from database.mongodb import db

def seed_products():
    """Seed products collection with glass products"""
    products = [
        {
            'name': 'Mirror Glass',
            'category': 'Mirrors',
            'description': 'High-quality silvered mirror glass with crystal-clear reflection',
            'basePrice': 15,
            'image': 'https://images.pexels.com/photos/6186/light-man-person-red.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            'specifications': ['6mm thickness', 'Silvered backing', 'Polished edges', 'Moisture resistant'],
            'in_stock': True,
            'stock_quantity': 100
        },
        {
            'name': 'Window Glass',
            'category': 'Windows',
            'description': 'Clear float glass perfect for windows and architectural applications',
            'basePrice': 12,
            'image': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            'specifications': ['4mm thickness', 'Float glass', 'UV protection', 'Thermal resistant'],
            'in_stock': True,
            'stock_quantity': 150
        },
        {
            'name': 'Tempered Glass',
            'category': 'Safety',
            'description': 'Heat-treated safety glass with enhanced strength and durability',
            'basePrice': 25,
            'image': 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            'specifications': ['8mm thickness', 'Safety certified', 'Heat resistant', 'Shatterproof'],
            'in_stock': True,
            'stock_quantity': 75
        },
        {
            'name': 'Frosted Glass',
            'category': 'Decorative',
            'description': 'Elegant frosted glass for privacy and decorative applications',
            'basePrice': 18,
            'image': 'https://images.pexels.com/photos/1020315/pexels-photo-1020315.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            'specifications': ['5mm thickness', 'Acid etched', 'Privacy glass', 'Easy to clean'],
            'in_stock': True,
            'stock_quantity': 90
        },
        {
            'name': 'Laminated Glass',
            'category': 'Safety',
            'description': 'Multi-layer safety glass with interlayer for enhanced security',
            'basePrice': 30,
            'image': 'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            'specifications': ['6.38mm thickness', 'PVB interlayer', 'Security glass', 'Sound dampening'],
            'in_stock': True,
            'stock_quantity': 60
        },
        {
            'name': 'Tinted Glass',
            'category': 'Decorative',
            'description': 'Colored glass available in various tints for aesthetic appeal',
            'basePrice': 20,
            'image': 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            'specifications': ['5mm thickness', 'Color options', 'UV filtering', 'Fade resistant'],
            'in_stock': True,
            'stock_quantity': 80
        }
    ]
    
    try:
        # Clear existing products
        db.products.collection.delete_many({})
        
        # Insert new products
        for product_data in products:
            product = db.products.create_product(product_data)
            print(f"✅ Created product: {product['name']}")
        
        print(f"🎉 Successfully seeded {len(products)} products")
        
    except Exception as e:
        print(f"❌ Error seeding products: {e}")

from werkzeug.security import generate_password_hash

def seed_users():
    """Seed users collection with demo accounts"""
    users = [
        {
            'name': 'Demo User',
            'email': 'demo@edgecraft.com',
            'password_hash': generate_password_hash('demo123')
        },
        {
            'name': 'Admin User',
            'email': 'admin@edgecraftglass.com',
            'password_hash': generate_password_hash('admin123')
        }
    ]
    
    try:
        # Clear existing users
        db.users.collection.delete_many({})
        
        # Insert new users
        for user_data in users:
            user = db.users.create_user(user_data)
            print(f"✅ Created user: {user['email']}")
        
        print(f"🎉 Successfully seeded {len(users)} users")
        
    except Exception as e:
        print(f"❌ Error seeding users: {e}")

def seed_all():
    """Seed all collections"""
    print("🌱 Starting database seeding...")
    seed_users()
    seed_products()
    print("✅ Database seeding completed!")

if __name__ == "__main__":
    seed_all()