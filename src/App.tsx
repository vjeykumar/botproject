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

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onBackToProducts={() => setSelectedProduct(null)}
        showBackButton={!!selectedProduct}
      />
      {!selectedProduct && <Hero />}
      
      <main className="container mx-auto px-4 py-8">
        {selectedProduct ? (
          <ProductDetails 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
          />
        ) : (
          <>
            {activeSection === 'products' && <ProductCatalog onProductClick={setSelectedProduct} />}
            {activeSection === 'orders' && <OrdersPage />}
            {activeSection === 'feedback' && <CustomerFeedback />}
          </>
        )}
        {activeSection === 'gifts' && <GiftProducts />}
        {activeSection === 'cart' && <Cart onBackToProducts={() => setActiveSection('products')} />}
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