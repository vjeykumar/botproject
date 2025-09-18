import React, { useState } from 'react';
import { useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Search, Filter } from 'lucide-react';
import { apiService } from '../services/api';
import { resolveProductImage } from '../utils/productImages';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  image?: string | null;
  specifications?: string[];
}


interface ProductCatalogProps {
  onProductClick: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        const normalizedProducts = (response.products || []).map((product: Product) => {
          const { src } = resolveProductImage({
            image: product.image,
            name: product.name,
            description: product.description,
            category: product.category,
          });

          return {
            ...product,
            image: src,
          };
        });

        setProducts(normalizedProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
        // Fallback to static products if API fails
        setProducts([
          {
            id: '1',
            name: 'Mirror Glass',
            category: 'Mirrors',
            description: 'High-quality silvered mirror glass with crystal-clear reflection',
            basePrice: 15,
            image: 'https://images.pexels.com/photos/6186/light-man-person-red.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            specifications: ['6mm thickness', 'Silvered backing', 'Polished edges', 'Moisture resistant']
          },
          {
            id: '2',
            name: 'Window Glass',
            category: 'Windows',
            description: 'Clear float glass perfect for windows and architectural applications',
            basePrice: 12,
            image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            specifications: ['4mm thickness', 'Float glass', 'UV protection', 'Thermal resistant']
          },
          {
            id: '3',
            name: 'Tempered Glass',
            category: 'Safety',
            description: 'Heat-treated safety glass with enhanced strength and durability',
            basePrice: 25,
            image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            specifications: ['8mm thickness', 'Safety certified', 'Heat resistant', 'Shatterproof']
          }
        ].map(product => {
          const { src } = resolveProductImage(product);
          return {
            ...product,
            image: src,
          };
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Glass Products</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our premium selection of glass products and customize them to your exact requirements
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">{error}. Showing cached products.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category, index) => (
              <option key={`${category}-${index}`} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};