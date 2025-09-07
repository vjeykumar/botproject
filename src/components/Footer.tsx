import React from 'react';
import { Diamond, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Diamond className="h-8 w-8 text-blue-400 opacity-80" />
                <Diamond className="h-6 w-6 text-blue-300 absolute top-1 left-1 opacity-60" />
                <Diamond className="h-4 w-4 text-blue-100 absolute top-2 left-2 opacity-40" />
              </div>
              <h3 className="text-xl font-bold">Edgecraft Glass</h3>
            </div>
            <p className="text-gray-400">
              Premium glass products with custom dimensions and professional quality.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Mirror Glass</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Window Glass</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tempered Glass</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Custom Solutions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Installation Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@edgecraftglass.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Glass Street, City, State</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Edgecraft Glass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};