import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetails } from './components/ProductDetails';
import { GiftProducts } from './components/GiftProducts';
import { Cart } from './components/Cart';
import { OrdersPage } from './components/OrdersPage';
import { CustomerFeedback } from './components/CustomerFeedback';
import { Footer } from './components/Footer';
import { CartProvider } from './contexts/CartContext';
import { Product } from './components/ProductCatalog';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<'products' | 'gifts' | 'cart' | 'feedback' | 'orders'>('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSectionChange = (
    section: 'products' | 'gifts' | 'cart' | 'feedback' | 'orders'
  ) => {
    setActiveSection(section);
    setSelectedProduct(null);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setActiveSection('products');
  };

  const renderContent = () => {
    if (selectedProduct) {
      return (
        <ProductDetails
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
        />
      );
    }

    switch (activeSection) {
      case 'gifts':
        return <GiftProducts />;
      case 'orders':
        return <OrdersPage />;
      case 'feedback':
        return <CustomerFeedback />;
      case 'cart':
        return <Cart onBackToProducts={handleBackToProducts} />;
      case 'products':
      default:
        return <ProductCatalog onProductClick={setSelectedProduct} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        onBackToProducts={handleBackToProducts}
        showBackButton={!!selectedProduct}
      />
      {!selectedProduct && activeSection === 'products' && <Hero />}

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;