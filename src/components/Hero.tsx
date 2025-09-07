import React from 'react';
import { Sparkles, Shield, Truck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Premium Glass Products
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Customize your perfect glass solution with precise dimensions and professional quality
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:shadow-lg animate-bounce-slow">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2 transform transition-all duration-300 hover:text-yellow-200">Custom Dimensions</h3>
            <p className="text-blue-100 transform transition-all duration-300 hover:text-white">Tailored to your exact specifications</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:shadow-lg animate-bounce-slow" style={{animationDelay: '0.2s'}}>
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2 transform transition-all duration-300 hover:text-yellow-200">Premium Quality</h3>
            <p className="text-blue-100 transform transition-all duration-300 hover:text-white">Professional-grade materials</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:shadow-lg animate-bounce-slow" style={{animationDelay: '0.4s'}}>
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2 transform transition-all duration-300 hover:text-yellow-200">Fast Delivery</h3>
            <p className="text-blue-100 transform transition-all duration-300 hover:text-white">Quick and secure shipping</p>
          </div>
        </div>
      </div>
    </section>
  );
};