import React, { useState } from 'react';
import { ArrowLeft, Calculator, ShoppingCart, Star, Shield, Truck, Award } from 'lucide-react';
import { Product } from './ProductCatalog';
import { useCart } from '../contexts/CartContext';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  const [height, setHeight] = useState(24);
  const [width, setWidth] = useState(36);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const area = (height * width) / 144; // Convert to square feet
  const totalPrice = area * product.basePrice * quantity;

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      price: totalPrice,
      quantity: 1,
      customization: {
        height,
        width,
        area: area.toFixed(2),
        quantity
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </button>
        <nav className="text-sm text-gray-500">
          <span>Products</span> / <span className="text-gray-800">{product.name}</span>
        </nav>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          
          {/* Product Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-md">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800">Premium Quality</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md">
              <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800">Fast Delivery</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800">Certified</p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">(4.8)</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-3">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customization */}
          <div className="bg-white border-2 border-blue-100 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Customize Your Order</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (inches)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width (inches)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max="50"
                className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>

            {/* Price Calculation */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-800">Price Calculation</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Dimensions:</span>
                  <span className="font-medium">{height}" × {width}"</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Area:</span>
                  <span className="font-medium">{area.toFixed(2)} sq ft</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Price per sq ft:</span>
                  <span className="font-medium">₹{product.basePrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Quantity:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-800">Total Price:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-3"
            >
              <ShoppingCart className="h-6 w-6" />
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Additional Information</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Professional installation available</li>
              <li>• 30-day return policy</li>
              <li>• Free shipping on orders over $100</li>
              <li>• Custom cutting to exact specifications</li>
              <li>• Quality guarantee on all products</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};