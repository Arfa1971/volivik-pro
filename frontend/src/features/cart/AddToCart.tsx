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
    if (clientType === 'custab') {
      return product.neto_promo_custab || product.neto_custab;
    }
    return product.neto_promo_partner || product.neto_partner;
  };

  const handleQuantityChange = (value: number) => {
    // Asegurarse de que la cantidad sea un múltiplo del pedido mínimo
    const multiplier = Math.max(1, Math.round(value / product.pedido_minimo));
    const newQuantity = multiplier * product.pedido_minimo;
    setQuantity(newQuantity);
  };

  const handleIncrement = () => {
    const newQuantity = quantity + product.pedido_minimo;
    setQuantity(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > product.pedido_minimo) {
      const newQuantity = quantity - product.pedido_minimo;
      setQuantity(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || product.pedido_minimo;
    handleQuantityChange(value);
  };

  const handleAddToCart = () => {
    if (quantity >= product.pedido_minimo) {
      setIsAdding(true);
      addToCart(product, quantity, clientType);
      
      // Mostrar feedback visual
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    }
  };

  const netPrice = getNetPrice();
  const totalPrice = netPrice * quantity;

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={quantity <= product.pedido_minimo}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={product.pedido_minimo}
          step={product.pedido_minimo}
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
        <p>Precio unitario: {netPrice.toFixed(2)}€</p>
        <p>Total: {totalPrice.toFixed(2)}€</p>
        <p className="text-xs">Pedido mínimo: {product.pedido_minimo} unidades</p>
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
