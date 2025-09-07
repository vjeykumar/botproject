import React from 'react';
import { ShoppingCart, Diamond, Gift, ArrowLeft, Star, User, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  activeSection: 'products' | 'gifts' | 'cart' | 'feedback';
  setActiveSection: (section: 'products' | 'gifts' | 'cart' | 'feedback') => void;
  onBackToProducts?: () => void;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeSection, 
  setActiveSection, 
  onBackToProducts,
  showBackButton = false 
}) => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={onBackToProducts}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Products</span>
              </button>
            )}
            <div className="flex items-center space-x-2">
            <div className="relative">
              <Diamond className="h-8 w-8 text-blue-600 opacity-80" />
              <Diamond className="h-6 w-6 text-blue-400 absolute top-1 left-1 opacity-60" />
              <Diamond className="h-4 w-4 text-blue-200 absolute top-2 left-2 opacity-40" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Edgecraft Glass</h1>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => setActiveSection('products')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeSection === 'products'
                  ? 'bg-blue-100 text-blue-700 shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Diamond className="h-5 w-5" />
              <span className="font-medium">Products</span>
            </button>
            
            <button
              onClick={() => setActiveSection('gifts')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeSection === 'gifts'
                  ? 'bg-blue-100 text-blue-700 shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Gift className="h-5 w-5" />
              <span className="font-medium">Gifts</span>
            </button>
            
            <button
              onClick={() => setActiveSection('feedback')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeSection === 'feedback'
                  ? 'bg-blue-100 text-blue-700 shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Star className="h-5 w-5" />
              <span className="font-medium">Reviews</span>
            </button>
            
            <button
              onClick={() => setActiveSection('cart')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 relative ${
                activeSection === 'cart'
                  ? 'bg-blue-100 text-blue-700 shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="font-medium">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'Guest'}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};