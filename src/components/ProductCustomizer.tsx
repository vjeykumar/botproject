import React, { useState } from 'react';
import { X, Calculator, ShoppingCart } from 'lucide-react';
import { Product } from './ProductCatalog';
import { useCart } from '../contexts/CartContext';

interface ProductCustomizerProps {
  product: Product;
  onClose: () => void;
}

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ product, onClose }) => {
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
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Customize {product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Specifications:</h4>
                <div className="flex flex-wrap gap-1">
                  {product.specifications.map((spec, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dimensions</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max="50"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-gray-800">Price Calculation</h4>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span>{height}" × {width}"</span>
                </div>
                <div className="flex justify-between">
                  <span>Area:</span>
                  <span>{area.toFixed(2)} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per sq ft:</span>
                  <span>₹{product.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};