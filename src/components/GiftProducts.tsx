import React, { useState } from 'react';
import { Gift, Heart, Star, ShoppingCart, Eye, Package, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { resolveProductImage } from '../utils/productImages';

interface GiftProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  popular: boolean;
  category: string;
  features: string[];
}

const giftProducts: GiftProduct[] = [
  {
    id: 'gift-1',
    name: 'Personalized Mirror Gift Set',
    description: 'Custom engraved mirror with elegant gift packaging and personalized message',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.pexels.com/photos/6186/light-man-person-red.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 124,
    popular: true,
    category: 'Personalized',
    features: ['Custom Engraving', 'Gift Box Included', 'Premium Quality', 'Lifetime Warranty']
  },
  {
    id: 'gift-2',
    name: 'Decorative Glass Panels',
    description: 'Artistic frosted glass panels perfect for home decor and room dividers',
    price: 129.99,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 89,
    popular: true,
    category: 'Decorative',
    features: ['Artistic Design', 'Multiple Sizes', 'Easy Installation', 'UV Resistant']
  },
  {
    id: 'gift-3',
    name: 'Premium Glass Photo Frame',
    description: 'Elegant beveled glass frame with premium finish for cherished memories',
    price: 45.99,
    originalPrice: 59.99,
    image: 'https://images.pexels.com/photos/1020315/pexels-photo-1020315.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 156,
    popular: false,
    category: 'Frames',
    features: ['Beveled Edges', 'Multiple Sizes', 'Wall Mount Ready', 'Crystal Clear']
  },
  {
    id: 'gift-4',
    name: 'Glass Coaster Set',
    description: 'Set of 6 tempered glass coasters with elegant gift box packaging',
    price: 34.99,
    image: 'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 203,
    popular: false,
    category: 'Home Decor',
    features: ['Set of 6', 'Tempered Glass', 'Gift Box', 'Heat Resistant']
  },
  {
    id: 'gift-5',
    name: 'Stained Glass Window Art',
    description: 'Handcrafted stained glass art piece with vibrant colors and intricate patterns',
    price: 199.99,
    image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 67,
    popular: true,
    category: 'Art',
    features: ['Handcrafted', 'Vibrant Colors', 'Unique Design', 'Certificate of Authenticity']
  },
  {
    id: 'gift-6',
    name: 'Glass Candle Holders',
    description: 'Set of 3 elegant glass candle holders in varying heights for ambient lighting',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 91,
    popular: false,
    category: 'Home Decor',
    features: ['Set of 3', 'Varying Heights', 'Ambient Lighting', 'Easy to Clean']
  },
  {
    id: 'gift-7',
    name: 'Crystal Glass Vase',
    description: 'Stunning crystal glass vase with intricate cut patterns, perfect for flowers',
    price: 149.99,
    image: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 78,
    popular: true,
    category: 'Decorative',
    features: ['Crystal Glass', 'Cut Patterns', 'Multiple Sizes', 'Gift Wrapped']
  },
  {
    id: 'gift-8',
    name: 'Glass Jewelry Box',
    description: 'Elegant glass jewelry box with velvet interior and secure locking mechanism',
    price: 79.99,
    image: 'https://images.pexels.com/photos/1927574/pexels-photo-1927574.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 112,
    popular: false,
    category: 'Storage',
    features: ['Velvet Interior', 'Secure Lock', 'Multiple Compartments', 'Elegant Design']
  }
];

export const GiftProducts: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [selectedProduct, setSelectedProduct] = useState<GiftProduct | null>(null);
  const { addToCart } = useCart();

  const categories = [
    'All',
    ...Array.from(new Set(giftProducts.map(p => p.category))).filter(
      category => category !== 'Personalized'
    )
  ];

  const filteredAndSortedProducts = giftProducts
    .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.reviewCount - a.reviewCount;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleAddToCart = (product: GiftProduct) => {
    addToCart({
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      price: product.price,
      quantity: 1,
      customization: {
        type: 'gift',
        description: product.description
      }
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (selectedProduct) {
    const { src, placeholder } = resolveProductImage(selectedProduct);

    return (
      <div className="max-w-7xl mx-auto">
        {/* Product Detail View */}
        <div className="mb-6">
          <button
            onClick={() => setSelectedProduct(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <Eye className="h-5 w-5" />
            <span>Back to Gift Products</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={src}
                alt={selectedProduct.name}
                className="w-full h-96 object-cover"
                onError={(event) => {
                  if (event.currentTarget.src !== placeholder) {
                    event.currentTarget.src = placeholder;
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <Gift className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800">Gift Ready</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800">Free Shipping</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800">Premium Quality</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedProduct.category}
                </span>
                {selectedProduct.popular && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>Popular</span>
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{selectedProduct.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(selectedProduct.rating)}
                  <span className="text-gray-600 ml-2">({selectedProduct.reviewCount} reviews)</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{selectedProduct.description}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-800">₹{selectedProduct.price}</span>
                {selectedProduct.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">₹{selectedProduct.originalPrice}</span>
                )}
                {selectedProduct.originalPrice && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    Save ₹{(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedProduct.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="bg-white border-2 border-pink-100 rounded-xl p-6">
              <button
                onClick={() => handleAddToCart(selectedProduct)}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-3"
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Add to Cart</span>
              </button>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Free gift wrapping included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Personalization available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Perfect for special occasions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="relative">
            <Gift className="h-10 w-10 text-pink-600" />
            <Sparkles className="h-6 w-6 text-pink-400 absolute -top-1 -right-1" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800">Glass Gift Collection</h2>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Discover our curated collection of exquisite glass gifts, perfect for any special occasion. 
          Each piece is carefully crafted with attention to detail and comes beautifully packaged.
        </p>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Categories:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">🎁 Special Gift Offer</h3>
        <p className="text-pink-100 mb-4">Free personalization and gift wrapping on orders over ₹100</p>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Package className="h-4 w-4" />
            <span>Free Gift Wrap</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sparkles className="h-4 w-4" />
            <span>Free Engraving</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>Perfect for Gifts</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map(product => {
          const { src, placeholder } = resolveProductImage(product);

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={src}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                  onError={(event) => {
                    if (event.currentTarget.src !== placeholder) {
                      event.currentTarget.src = placeholder;
                    }
                  }}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.popular && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Quick View Button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Quick View</span>
                  </button>
                </div>
              </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-gray-500 text-xs ml-1">({product.reviewCount})</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            </div>
            </div>
          );
        })}
      </div>

      {/* Gift Services */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Gift Services</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-pink-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-pink-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Free Gift Wrapping</h4>
            <p className="text-gray-600">Beautiful gift wrapping included with every purchase</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Custom Engraving</h4>
            <p className="text-gray-600">Personalize your gifts with custom messages</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Express Delivery</h4>
            <p className="text-gray-600">Fast and secure delivery for last-minute gifts</p>
          </div>
        </div>
      </div>

      {/* Gift Occasions */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Perfect for Every Occasion</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { occasion: 'Weddings', emoji: '💒' },
            { occasion: 'Anniversaries', emoji: '💕' },
            { occasion: 'Birthdays', emoji: '🎂' },
            { occasion: 'Housewarming', emoji: '🏠' },
            { occasion: 'Graduations', emoji: '🎓' },
            { occasion: 'Corporate Gifts', emoji: '🏢' },
            { occasion: 'Holidays', emoji: '🎄' },
            { occasion: 'Thank You', emoji: '🙏' }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <p className="text-sm font-medium text-gray-800">{item.occasion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};