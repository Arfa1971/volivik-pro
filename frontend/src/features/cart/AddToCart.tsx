import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { Plus, Minus } from 'lucide-react';

interface AddToCartProps {
  product: Product;
  clientType: 'custab' | 'partner';
}

export const AddToCart: React.FC<AddToCartProps> = ({ product, clientType }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(product.pedido_minimo);
  const [isAdding, setIsAdding] = useState(false);

  const getNetPrice = () => {
    // Para los productos especiales
    if (['8757712', '9203013', '9339613'].includes(product.codigo)) {
      if (quantity < 120) {
        // Si no llega a 120 unidades, usar precio neto sin promoción
        return clientType === 'custab' ? product.neto_custab : product.neto_partner;
      } else {
        // Si es >= 120 unidades, usar precio promocional
        return clientType === 'custab' ? product.neto_promo_custab : product.neto_promo_partner;
      }
    }

    // Para otros productos, usar precio promocional si existe
    if (clientType === 'custab') {
      return product.neto_promo_custab || product.neto_custab;
    }
    return product.neto_promo_partner || product.neto_partner;
  };

  // Determinar si se debe mostrar el precio promocional
  const shouldShowPromo = product.codigo === '8757712'
    ? quantity >= 120 // Solo mostrar promo para 8757712 si es >= 120 unidades
    : true; // Para otros productos, mostrar promo si existe

  const handleQuantityChange = (value: number) => {
    const minQuantity = product.pedido_minimo;

    // No permitir cantidades menores al pedido mínimo
    if (value < minQuantity) {
      setQuantity(minQuantity);
      return;
    }

    // Asegurarse de que la cantidad sea un múltiplo del pedido mínimo
    const multiplier = Math.max(1, Math.round(value / minQuantity));
    const newQuantity = multiplier * minQuantity;
    setQuantity(newQuantity);
  };

  const handleIncrement = () => {
    const productosEspeciales = ['8757704', '8757712', '9203013', '9339613'];
    const incrementUnit = productosEspeciales.includes(product.codigo)
      ? product.unidades_por_caja
      : product.pedido_minimo;
    const newQuantity = quantity + incrementUnit;
    setQuantity(newQuantity);
  };

  const handleDecrement = () => {
    const productosEspeciales = ['8757704', '8757712', '9203013', '9339613'];
    const decrementUnit = productosEspeciales.includes(product.codigo)
      ? product.unidades_por_caja
      : product.pedido_minimo;
    if (quantity > decrementUnit) {
      const newQuantity = quantity - decrementUnit;
      setQuantity(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || product.pedido_minimo;
    handleQuantityChange(value);
  };

  const handleAddToCart = () => {
    const productosEspeciales = ['8757704', '8757712', '9203013', '9339613'];
    const minQuantity = productosEspeciales.includes(product.codigo) ? product.unidades_por_caja : product.pedido_minimo;
    if (quantity >= minQuantity) {
      setIsAdding(true);
      addToCart(product, quantity, clientType);
      
      // Mostrar feedback visual
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    }
  };

  let netPrice;
  let totalPrice;

  if (product.codigo === '8757712') {
    // Para el código 8757712, usar precio neto si cantidad < 120
    if (quantity < 120) {
      netPrice = clientType === 'custab' ? product.neto_custab : product.neto_partner;
    } else {
      netPrice = clientType === 'custab' ? product.neto_promo_custab : product.neto_promo_partner;
    }
  } else {
    netPrice = getNetPrice();
  }
  totalPrice = (netPrice ?? 0) * quantity;

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={quantity <= (['8757704', '8757712', '9203013', '9339613'].includes(product.codigo) ? product.unidades_por_caja : product.pedido_minimo)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={product.familia_producto === 'PLASTIDECOR1' ? product.unidades_por_caja : product.pedido_minimo}
          step={product.familia_producto === 'PLASTIDECOR1' ? product.unidades_por_caja : product.pedido_minimo}
          className="w-20 text-center"
        />
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        <p>Precio unitario: {(netPrice ?? 0).toFixed(2)}€</p>
        <p>Total: {totalPrice.toFixed(2)}€</p>
        <p className="text-xs">
          {product.familia_producto === 'PLASTIDECOR1'
            ? `Mínimo por caja: ${product.unidades_por_caja} unidades`
            : `Pedido mínimo: ${product.pedido_minimo} unidades`
          }
        </p>
        {product.familia_producto === 'PLASTIDECOR1' && quantity < 120 && (
          <p className="text-xs text-orange-600 mt-1">
            * Precio promocional a partir de 10 cajas (120 uds)
          </p>
        )}
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isAdding || quantity < product.pedido_minimo}
        className="w-full"
      >
        {isAdding ? 'Añadiendo...' : 'Añadir al carrito'}
      </Button>
    </div>
  );
};

export default AddToCart;
