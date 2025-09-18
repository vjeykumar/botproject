import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Package, CreditCard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { PaymentScreen } from './PaymentScreen';
import { PaymentSuccess } from './PaymentSuccess';

interface CartProps {
  onBackToProducts: () => void;
}

export const Cart: React.FC<CartProps> = ({ onBackToProducts }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState<'cart' | 'payment' | 'success'>('cart');

  const handleCheckout = () => {
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('success');
  };
  
  const handleViewOrders = () => {
    setCurrentStep('cart');
    onBackToProducts();
    // This would ideally trigger navigation to orders page
    // For now, we'll just go back to products
  };

  const handleBackToCart = () => {
    setCurrentStep('cart');
  };

  const handleBackToHome = () => {
    setCurrentStep('cart');
    onBackToProducts();
  };

  if (currentStep === 'payment') {
    return (
      <PaymentScreen 
        onBack={handleBackToCart}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  if (currentStep === 'success') {
    return (
      <PaymentSuccess 
        onBackToHome={handleBackToHome}
        onViewOrders={handleViewOrders}
      />
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-600">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Shopping Cart</h2>
        <p className="text-gray-600">Review your items before checkout</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {cartItems.map(item => (
            <div key={item.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-800">{item.name}</h4>
                  
                  {item.customization && (
                    <div className="mt-2 text-sm text-gray-600">
                      {item.customization.height && item.customization.width && (
                        <div className="flex items-center space-x-4">
                          <span>Dimensions: {item.customization.height}" × {item.customization.width}"</span>
                          <span>Area: {item.customization.area} sq ft</span>
                          {item.customization.quantity && (
                            <span>Qty: {item.customization.quantity}</span>
                          )}
                        </div>
                      )}
                      {item.customization.type === 'gift' && (
                        <div>{item.customization.description}</div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-lg font-semibold text-gray-800 min-w-[100px] text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-blue-600">₹{getCartTotal().toFixed(2)}</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Package className="h-4 w-4" />
              <span>Free shipping on orders over ₹100</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>Proceed to Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};