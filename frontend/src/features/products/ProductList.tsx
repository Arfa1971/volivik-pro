import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { ProductImages } from './ProductImages';
import ProductDetails from './ProductDetails';
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

  // Función para formatear precios
  const formatPrice = (price: number | undefined | null): string => {
    if (typeof price !== 'number') return '0.00';
    return price.toFixed(2);
  };

  // Función para formatear descuentos
  const formatDiscount = (discount: number | undefined | null): string => {
    if (typeof discount !== 'number' || discount === 0) return '';
    return `-${discount}%`;
  };

  // Manejar cambios en la cantidad
  const handleQuantityChange = (productId: string, value: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const minQuantity = product.pedido_minimo;
    const newQuantity = Math.max(minQuantity, value);

    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = (
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedFamily === '_all') {
      const hasRealPromotion = clientType === 'custab'
        ? (product.neto_promo_custab !== null && product.descuento_promo_q > 0)
        : (product.neto_promo_partner !== null && product.descuento_promo_q > 0);
      return matchesSearch && hasRealPromotion;
    }

    if (selectedFamily === '_none') {
      return matchesSearch;
    }

    return matchesSearch && product.familia_producto === selectedFamily;
  });

  // Obtener familias únicas para el filtro
  const uniqueFamilies = Array.from(new Set(products.map(p => p.familia_producto))).filter(Boolean).sort();
  const filteredFamilies = familySearchTerm
    ? uniqueFamilies.filter(f => f.toLowerCase().includes(familySearchTerm.toLowerCase()))
    : uniqueFamilies;

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

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
                className="w-full border-orange-200 focus-visible:ring-orange-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-orange-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-orange-100">
                <th className="text-left p-4 bg-orange-50/50 font-medium text-orange-900">Código</th>
                <th className="text-left p-4 bg-orange-50/50 font-medium text-orange-900">Descripción</th>
                <th className="text-right p-4 bg-orange-50/50 font-medium text-orange-900">Precio</th>
                <th className="text-center p-4 bg-orange-50/50 font-medium text-orange-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product) => {
                const quantity = quantities[product.id] || product.pedido_minimo;
                const price = clientType === 'custab'
                  ? (product.neto_promo_custab || product.neto_custab)
                  : (product.neto_promo_partner || product.neto_partner);

                return (
                  <tr key={product.id} className="border-b border-orange-100 hover:bg-orange-50/30">
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        {product.codigo}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-left hover:text-orange-600"
                      >
                        <div className="font-medium">{product.descripcion}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {product.familia_producto}
                          {product.categoria && (
                            <Badge variant="outline" className="ml-2 border-orange-200">
                              {product.categoria}
                            </Badge>
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium">{formatPrice(price)}€</div>
                      {product.descuento_promo_q > 0 && (
                        <div className="text-sm font-medium text-green-600 mt-1">
                          {formatDiscount(product.descuento_promo_q)}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {selectedProduct && (
            <ProductDetails
              product={selectedProduct}
              clientType={clientType}
              onClose={() => setSelectedProduct(null)}
            />
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
