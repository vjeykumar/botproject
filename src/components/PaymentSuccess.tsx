import React from 'react';
import { CheckCircle, Download, Home, Package } from 'lucide-react';

interface PaymentSuccessProps {
  onBackToHome: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onBackToHome }) => {
  const orderNumber = `EG${Date.now().toString().slice(-6)}`;
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 text-lg mb-8">
            Thank you for your order. Your glass products are being prepared for shipment.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold text-gray-800">{orderNumber}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-semibold text-gray-800">{estimatedDelivery}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold text-gray-800">Credit Card</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <p className="font-semibold text-green-600">Confirmed</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What happens next?</h3>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <p className="text-gray-700">Order confirmation email sent to your inbox</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <p className="text-gray-700">Glass cutting and quality inspection (1-2 days)</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <p className="text-gray-700">Secure packaging and shipment (3-5 days)</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <p className="text-gray-700">Delivery to your doorstep</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Download className="h-5 w-5" />
              <span>Download Invoice</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Package className="h-5 w-5" />
              <span>Track Order</span>
            </button>
            
            <button
              onClick={onBackToHome}
              className="flex items-center justify-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Continue Shopping</span>
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@edgecraftglass.com" className="text-blue-600 hover:underline">
                support@edgecraftglass.com
              </a>{' '}
              or call{' '}
              <a href="tel:+15551234567" className="text-blue-600 hover:underline">
                (555) 123-4567
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};