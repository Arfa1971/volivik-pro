import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';

import { ProductImages } from './ProductImages';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string;
}

export function ProductList({ products, loading = false, error }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [familySearchTerm, setFamilySearchTerm] = useState('');
  const [clientType, setClientType] = useState<'custab' | 'partner'>('custab');
  const [selectedFamily, setSelectedFamily] = useState<string>('_none');
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const itemsPerPage = 10;
  const { addToCart } = useCart();

  console.log('ProductList render:', {
    loading,
    error,
    productsCount: products.length,
    searchTerm,
    familySearchTerm,
    clientType,
    selectedFamily
  });

  // Manejar estados de carga y error
  const renderLoadingOrError = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Cargando productos...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      );
    }

    if (!products || products.length === 0) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">No se encontraron productos</div>
        </div>
      );
    }

    return null;
  };

  const loadingOrError = renderLoadingOrError();
  if (loadingOrError) return loadingOrError;

  // Obtener todas las familias únicas y ordenarlas
  const families = Array.from(new Set(products.map(p => p.familia_producto)))
    .filter(family => family && family.trim() !== '') // Eliminar familias vacías
    .sort((a, b) => a.localeCompare(b)); // Ordenar alfabéticamente

  // Filtrar familias por término de búsqueda
  const filteredFamilies = familySearchTerm
    ? families.filter(family =>
        family.toLowerCase().includes(familySearchTerm.toLowerCase())
      )
    : families;

  console.log('Familias disponibles:', {
    todas: families,
    filtradas: filteredFamilies,
    busqueda: familySearchTerm,
    seleccionada: selectedFamily
  });

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, value)
    }));
  };

  const filteredProducts = products.filter(product => {
    // Filtrar por término de búsqueda en código o descripción
    const matchesSearch = (
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Si está seleccionado "Con Promoción Q", solo mostrar productos con promoción real
    if (selectedFamily === '_all') {
      const hasRealPromotion = clientType === 'custab' 
        ? (product.neto_promo_custab !== null && product.descuento_promo_q > 0)
        : (product.neto_promo_partner !== null && product.descuento_promo_q > 0);
      return matchesSearch && hasRealPromotion;
    }

    // Si está seleccionado "Todos los productos"
    if (selectedFamily === '_none') {
      return matchesSearch;
    }

    // Para selecciones específicas de familia
    const matchesFamily = product.familia_producto === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const formatPrice = (price: number | undefined | null): string => {
    if (typeof price !== 'number') return '0.00';
    return price.toFixed(2);
  };

  const formatDiscount = (discount: number | undefined | null): string => {
    if (typeof discount !== 'number' || discount === 0) return '';
    return `-${discount}%`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-orange-100">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-orange-700 font-medium">
            <Filter className="h-5 w-5" />
            <span className="text-lg">Filtros:</span>
          </div>

          <Select value={selectedFamily} onValueChange={setSelectedFamily}>
            <SelectTrigger className="w-[250px] border-orange-200 hover:border-orange-400 transition-colors">
              <SelectValue placeholder="FAMILIA PRODUCTO" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <div className="sticky top-0 bg-white p-2 border-b border-orange-100">
                <Input
                  placeholder="Buscar familia..."
                  value={familySearchTerm}
                  onChange={(e) => setFamilySearchTerm(e.target.value)}
                  className="h-9 border-orange-200 focus-visible:ring-orange-400"
                />
              </div>
              <SelectItem value="_none" className="hover:bg-orange-50">Todos los productos</SelectItem>
              <SelectItem value="_all" className="hover:bg-orange-50">Con Promoción Q</SelectItem>
              {filteredFamilies.map(family => (
                <SelectItem key={family} value={family} className="hover:bg-orange-50">
                  {family}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 bg-orange-50 p-1 rounded-lg border border-orange-100">
            <Button
              variant={clientType === 'custab' ? 'default' : 'outline'}
              onClick={() => setClientType('custab')}
              className={`h-9 px-4 ${clientType === 'custab' ? 'bg-[#E49B0F] hover:bg-[#D38C0E]' : 'border-orange-200 hover:bg-orange-100'}`}
            >
              Custab
            </Button>
            <Button
              variant={clientType === 'partner' ? 'default' : 'outline'}
              onClick={() => setClientType('partner')}
              className={`h-9 px-4 ${clientType === 'partner' ? 'bg-[#E49B0F] hover:bg-[#D38C0E]' : 'border-orange-200 hover:bg-orange-100'}`}
            >
              Partner
            </Button>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Input
                placeholder="Buscar por código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 h-9 border-orange-200 focus-visible:ring-orange-400"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-orange-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E49B0F] text-white font-medium">
                <th className="px-6 py-3 text-left whitespace-nowrap text-sm uppercase tracking-wider">Ficha</th>
                <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-right text-sm uppercase tracking-wider">Tarifa</th>
                <th className="px-6 py-3 text-right text-sm uppercase tracking-wider">Base</th>
                <th className="px-6 py-3 text-right text-sm uppercase tracking-wider">{clientType === 'custab' ? 'Custab' : 'Partner'}</th>
                <th className="px-6 py-3 text-right text-sm uppercase tracking-wider">Neto {clientType === 'custab' ? 'Custab' : 'Partner'}</th>
                <th className="px-6 py-3 text-right text-sm uppercase tracking-wider">Promo</th>
                <th className="px-6 py-3 text-right text-sm uppercase tracking-wider">Neto Final</th>
                <th className="px-6 py-3 text-center text-sm uppercase tracking-wider">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product) => {
                const quantity = quantities[product.id] || product.pedido_minimo;
                const basePrice = product.precio_tarifa;
                const baseDiscount = product.descuento_1;
                const clientDiscount = clientType === 'custab' ? product.descuento_custab : product.descuento_partner;
                const netPrice = clientType === 'custab' ? product.neto_custab : product.neto_partner;
                const promoDiscount = product.descuento_promo_q;
                const finalPrice = clientType === 'custab' ? 
                  (product.neto_promo_custab || product.neto_custab) : 
                  (product.neto_promo_partner || product.neto_partner);

                return (
                  <tr key={product.id} className="even:bg-[#FDF6E7] odd:bg-white border-b transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-10 w-10 p-0 rounded-lg hover:bg-orange-100"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <ProductImages 
                          productCode={product.codigo}
                          size="sm"
                        />
                      </Button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{product.descripcion}</div>
                        <div className="text-sm text-gray-500">{product.codigo} · Mín: {product.pedido_minimo} uds.</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.categoria === 'core' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {product.categoria.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      {formatPrice(basePrice)}€
                    </td>
                    <td className="px-4 py-2 text-right text-pink-600">
                      {formatDiscount(baseDiscount)}
                    </td>
                    <td className="px-4 py-2 text-right text-pink-600">
                      {formatDiscount(clientDiscount)}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      {formatPrice(netPrice)}€
                    </td>
                    <td className="px-4 py-2 text-right text-green-600">
                      {formatDiscount(promoDiscount)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium whitespace-nowrap">
                      {formatPrice(finalPrice)}€
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-orange-200 hover:bg-orange-100 hover:text-orange-600"
                          onClick={() => handleQuantityChange(product.id, quantity - product.pedido_minimo)}
                          disabled={quantity <= product.pedido_minimo}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || product.pedido_minimo)}
                          className="w-16 text-center border-orange-200 focus-visible:ring-orange-400"
                          min={product.pedido_minimo}
                          step={product.pedido_minimo}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-orange-200 hover:bg-orange-100 hover:text-orange-600"
                          onClick={() => handleQuantityChange(product.id, quantity + product.pedido_minimo)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-orange-200 hover:bg-orange-100 hover:text-orange-600"
                          onClick={() => addToCart(product, quantity, clientType)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl">
          <DialogDescription className="sr-only">
            Detalles del producto {selectedProduct?.descripcion}
          </DialogDescription>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedProduct?.descripcion}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Columna de imagen */}
                <div className="col-span-1">
                  <ProductImages 
                    productCode={selectedProduct.codigo}
                    size="lg"
                  />
                </div>

                {/* Columna de información */}
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Información General</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Código:</span>
                        <span className="font-medium">{selectedProduct.codigo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Familia:</span>
                        <span className="font-medium">{selectedProduct.familia_producto || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pedido Mínimo:</span>
                        <span className="font-medium">{selectedProduct.pedido_minimo} uds.</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Precios y Descuentos</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precio Tarifa:</span>
                        <span className="font-medium">{formatPrice(selectedProduct.precio_tarifa)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Descuento Base:</span>
                        <span className="font-medium text-pink-600">{formatDiscount(selectedProduct.descuento_1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Descuento {clientType === 'custab' ? 'Custab' : 'Partner'}:</span>
                        <span className="font-medium text-pink-600">
                          {formatDiscount(clientType === 'custab' ? selectedProduct.descuento_custab : selectedProduct.descuento_partner)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Promoción Q:</span>
                        <span className="font-medium text-green-600">{formatDiscount(selectedProduct.descuento_promo_q)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Precios Finales</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Neto {clientType === 'custab' ? 'Custab' : 'Partner'}:</span>
                      <span className="font-medium">
                        {formatPrice(clientType === 'custab' ? selectedProduct.neto_custab : selectedProduct.neto_partner)}€
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Neto Final:</span>
                      <span className="font-medium">
                        {formatPrice(clientType === 'custab' ? 
                          (selectedProduct.neto_promo_custab || selectedProduct.neto_custab) : 
                          (selectedProduct.neto_promo_partner || selectedProduct.neto_partner)
                        )}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-orange-100">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-9 px-3 border-orange-200 hover:bg-orange-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {(() => {
            const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
            const range = 2; // Número de páginas a mostrar a cada lado
            let pages = [];

            // Siempre mostrar primera página
            if (currentPage > 1 + range) {
              pages.push(1);
              if (currentPage > 2 + range) {
                pages.push('...');
              }
            }

            // Páginas alrededor de la actual
            for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
              pages.push(i);
            }

            // Siempre mostrar última página
            if (currentPage < totalPages - range) {
              if (currentPage < totalPages - range - 1) {
                pages.push('...');
              }
              pages.push(totalPages);
            }

            return pages.map((page, index) => 
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-[36px] font-medium ${currentPage === page 
                    ? 'bg-[#E49B0F] hover:bg-[#D38C0E] text-white shadow-sm' 
                    : 'border-orange-200 hover:bg-orange-100 text-gray-700'}`}
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-gray-400">...</span>
              )
            );
          })()}

          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
            className="h-9 px-3 border-orange-200 hover:bg-orange-100 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}