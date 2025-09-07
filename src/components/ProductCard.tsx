import React from 'react';
import { Ruler, Eye } from 'lucide-react';
import { Product } from './ProductCatalog';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
          onClick={() => onProductClick(product)}
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {product.category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Specifications:</h4>
          <div className="flex flex-wrap gap-1">
            {product.specifications.slice(0, 2).map((spec, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                {spec}
              </span>
            ))}
            {product.specifications.length > 2 && (
              <span className="text-gray-500 text-xs">+{product.specifications.length - 2} more</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-gray-600">
            <Ruler className="h-4 w-4" />
            <span className="text-sm">From ${product.basePrice}/sq ft</span>
          </div>
          
          <button
            onClick={() => onProductClick(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};