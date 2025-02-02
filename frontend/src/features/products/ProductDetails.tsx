import { useState } from 'react';
import { X, Package, Tag, Box, Info, Euro, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProductDetailsProps {
  product: Product;
  clientType: 'custab' | 'partner';
  onClose: () => void;
}

export default function ProductDetails({ product, clientType, onClose }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(product.pedido_minimo);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const price = clientType === 'custab'
    ? (product.neto_promo_custab || product.neto_custab)
    : (product.neto_promo_partner || product.neto_partner);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < product.pedido_minimo) {
      setQuantity(product.pedido_minimo);
      toast.error(`La cantidad mínima de pedido es ${product.pedido_minimo} unidades`);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, clientType);
    toast.success('Producto añadido al carrito', {
      duration: 1500,
      position: 'top-right',
      style: { backgroundColor: '#22c55e', color: 'white' }
    });
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 200);
  };

  return (
    <div className="relative bg-white p-4 sm:p-6 max-w-2xl mx-auto overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 -mx-4 sm:mx-0 px-4 sm:px-0 pb-4 border-b border-orange-100">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-orange-900 leading-tight">{product.descripcion}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-lg sm:text-base font-medium text-orange-600">{product.codigo}</span>
              {product.categoria && (
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-orange-50 text-orange-800 border border-orange-200">
                  {product.categoria}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-orange-50 rounded-full transition-colors duration-200"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6 text-orange-500" />
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Información del producto y logística */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
            <h3 className="text-base font-medium text-orange-800 flex items-center gap-2 mb-4">
              <Info className="h-5 w-5" />
              Detalles
            </h3>
            <div className="space-y-3">
              <div>
                <dt className="text-sm text-orange-600">EAN</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{product.ean?.toString() || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm text-orange-600">Familia</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{product.familia_producto}</dd>
              </div>
            </div>
          </div>

          <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
            <h3 className="text-base font-medium text-orange-800 flex items-center gap-2 mb-4">
              <Box className="h-5 w-5" />
              Logística
            </h3>
            <div className="space-y-3">
              <div>
                <dt className="text-sm text-orange-600">Unidades/caja</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{product.unidades_por_caja}</dd>
              </div>
              <div>
                <dt className="text-sm text-orange-600">Pedido mínimo</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{product.pedido_minimo} uds</dd>
              </div>
            </div>
          </div>

          {/* Precios */}
          <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
            <h3 className="text-base font-medium text-orange-800 flex items-center gap-2 mb-4">
              <Euro className="h-5 w-5" />
              Precios
            </h3>
            <div className="grid gap-3">
              <div>
                <dt className="text-sm text-orange-600">Tarifa base</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{product.precio_tarifa}€</dd>
              </div>
              <div>
                <dt className="text-sm text-orange-600">Descuento base</dt>
                <dd className="text-base font-medium text-green-600 mt-1">{product.descuento_1}%</dd>
              </div>
              <div>
                <dt className="text-sm text-orange-600">
                  Dto. {clientType === 'custab' ? 'Custab' : 'Partner'}
                </dt>
                <dd className="text-base font-medium text-green-600 mt-1">
                  {clientType === 'custab' ? product.descuento_custab : product.descuento_partner}%
                </dd>
              </div>
              <div>
                <dt className="text-sm text-orange-600">Precio neto</dt>
                <dd className="text-lg font-semibold text-[#E49B0F] mt-1">
                  {(clientType === 'custab' ? product.neto_custab : product.neto_partner).toFixed(2)}€
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Promoción si existe */}
        {product.promocion_familia && (
          <div className="bg-green-50/50 p-5 rounded-xl border border-green-200">
            <h3 className="text-lg font-medium text-green-800 flex items-center gap-2 mb-3">
              <Tag className="h-6 w-6" />
              ¡Promoción activa!
            </h3>
            <p className="text-base text-green-700 leading-relaxed">{product.promocion_familia}</p>
            <div className="mt-4 p-3 bg-white/50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">Precio promocional:</p>
              <p className="text-xl font-semibold text-green-800 mt-1">
                {clientType === 'custab' 
                  ? (product.neto_promo_custab?.toFixed(2) || 'N/A') 
                  : (product.neto_promo_partner?.toFixed(2) || 'N/A')}€
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Cantidad y añadir al carrito - Fijo en la parte inferior */}
      <div className="sticky bottom-0 bg-white -mx-4 sm:mx-0 px-4 sm:px-0 pt-4 pb-4 mt-6 border-t border-orange-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-14 border-orange-200 text-orange-600 hover:bg-orange-50 text-xl"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= product.pedido_minimo}
              >
                -
              </Button>
              <input
                type="number"
                id="quantity"
                min={product.pedido_minimo}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="h-14 w-24 p-2 border border-orange-200 rounded-lg text-center text-xl font-medium"
              />
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-14 border-orange-200 text-orange-600 hover:bg-orange-50 text-xl"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </div>
            <div className="text-right">
              <div className="text-sm text-orange-600">Total</div>
              <div className="text-2xl font-semibold text-[#E49B0F]">{(price * quantity).toFixed(2)}€</div>
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`h-14 w-full bg-[#E49B0F] hover:bg-[#E49B0F]/90 text-white text-lg font-medium ${isAdding ? 'opacity-75' : ''}`}
          >
            {isAdding ? (
              <Check className="h-5 w-5 mr-2" />
            ) : null}
            Añadir al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}