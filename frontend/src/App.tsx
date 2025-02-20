import { useState, useEffect } from 'react';
import { ProductList } from '@/features/products/ProductList';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'sonner';
import { Product } from '@/types/product';
import Cart from '@/features/cart/Cart';
import { productService } from '@/services/productService';
import '@/lib/pdf';

function App() {
  console.log('App component initializing...');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('Current state:', { loading, error, productsCount: products.length });

  const fetchProducts = async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products...', category ? `for category: ${category}` : 'all');
      
      const data = category 
        ? await productService.getProductsByCategory(category)
        : await productService.getAllProducts();
      
      if (!Array.isArray(data)) {
        throw new Error('La respuesta de la API no es un array');
      }
      
      if (data.length === 0) {
        console.log('No se encontraron productos');
      }

      console.log('Total products loaded:', data.length);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/assets/logoBic.png" alt="BIC Logo" className="h-8" />
                <h1 className="text-xl font-semibold text-[#E49B0F]">
                  Tarifa BIC 2025
                </h1>
              </div>
              <Cart />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <ProductList 
              products={products} 
              loading={loading} 
              onCategoryChange={(category) => {
                if (category === 'all') {
                  fetchProducts();
                } else if (category !== 'promotion') {
                  fetchProducts(category);
                }
              }} 
            />
          )}
        </main>
        <Toaster position="top-right" />
      </div>
    </CartProvider>
  );
}

export { App };