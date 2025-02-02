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
    <div className="relative bg-white p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">{product.descripcion}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Columna 1: Información del producto */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4" />
            Información
          </h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs text-gray-500">Código</dt>
              <dd className="text-sm font-medium text-gray-900">{product.codigo}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">EAN</dt>
              <dd className="text-sm font-medium text-gray-900">{product.ean?.toString() || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Familia</dt>
              <dd className="text-sm font-medium text-gray-900">{product.familia_producto}</dd>
            </div>
          </dl>
        </div>

        {/* Columna 2: Información logística */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-4">
            <Box className="h-4 w-4" />
            Logística
          </h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs text-gray-500">Unidades/caja</dt>
              <dd className="text-sm font-medium text-gray-900">{product.unidades_por_caja}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Pedido mínimo</dt>
              <dd className="text-sm font-medium text-gray-900">{product.pedido_minimo} unidades</dd>
            </div>
          </dl>
        </div>

        {/* Columna 3: Precios y descuentos */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-4">
            <Euro className="h-4 w-4" />
            Precios
          </h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs text-gray-500">Tarifa base</dt>
              <dd className="text-sm font-medium text-gray-900">{product.precio_tarifa}€</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Descuento base</dt>
              <dd className="text-sm font-medium text-purple-600">{product.descuento_1}%</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">
                Descuento {clientType === 'custab' ? 'Custab' : 'Partner'}
              </dt>
              <dd className="text-sm font-medium text-purple-600">
                {clientType === 'custab' ? product.descuento_custab : product.descuento_partner}%
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Precio neto por unidad</dt>
              <dd className="text-sm font-medium text-blue-600">
                {(clientType === 'custab' ? product.neto_custab : product.neto_partner).toFixed(2)}€
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Promoción si existe */}
      {product.promocion_familia && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-sm font-medium text-green-800 flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4" />
            Promoción activa
          </h3>
          <p className="text-sm text-green-700">{product.promocion_familia}</p>
          <p className="text-sm font-medium text-green-800 mt-2">
            Precio promocional por unidad: {clientType === 'custab' 
              ? (product.neto_promo_custab?.toFixed(2) || 'N/A') 
              : (product.neto_promo_partner?.toFixed(2) || 'N/A')}€
          </p>
        </div>
      )}

      {/* Cantidad y añadir al carrito */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Cantidad:
            </label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
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
                className="w-20 p-2 border rounded text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 ${isAdding ? 'opacity-75' : ''}`}
          >
            {isAdding ? (
              <Check className="h-5 w-5 mr-2" />
            ) : null}
            Añadir al carrito ({(price * quantity).toFixed(2)}€)
          </Button>
        </div>
      </div>
    </div>
  );
}