import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '@/types/product';

type ClientType = 'custab' | 'partner';

interface CartItem {
  product: Product;
  quantity: number;
  clientType: ClientType;
}

interface CartState {
  cartItems: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; clientType: ClientType } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, clientType: ClientType) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  boxesByFamily: Record<string, number>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity, clientType } = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        item => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.cartItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return { ...state, cartItems: updatedItems };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, { product, quantity, clientType }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.product.id !== action.payload),
      };
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, cartItems: [] };
    default:
      return state;
  }
}

// Lista de familias que pueden tener la promoción de 10 cajas
const FAMILIAS_CON_PROMOCION = [
  "CRISTAL EXACT",
  "CRISTAL FINE",
  "CRISTAL LARGE",
  "CRISTAL SOFT",
  "CRISTAL FUN",
  "CRISTAL UP",
  "PLASTIDECOR1" // Añadir PLASTIDECOR1 a las familias con promoción
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });

  const addToCart = (product: Product, quantity: number, clientType: ClientType) => {
    if (quantity < product.pedido_minimo) {
      console.error(`La cantidad mínima de pedido es ${product.pedido_minimo}`);
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, clientType } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Calcular total de cajas por familia
  const boxesByFamily = state.cartItems.reduce((acc, item) => {
    const family = item.product.familia_producto;
    acc[family] = (acc[family] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const total = state.cartItems.reduce((sum, item) => {
    let finalPrice;

    if (item.product.codigo === '8757704') {
      // Para el producto 8757704, verificar si la cantidad es >= 10 cajas (120 unidades)
      const basePrice = item.clientType === 'custab'
        ? item.product.neto_custab
        : item.product.neto_partner;

      const familyBoxes = boxesByFamily[item.product.familia_producto] || 0;
      const hasPromoPrice = item.clientType === 'custab'
        ? item.product.neto_promo_custab
        : item.product.neto_promo_partner;

      finalPrice = familyBoxes >= 10 && hasPromoPrice
        ? (item.clientType === 'custab' ? item.product.neto_promo_custab : item.product.neto_promo_partner)
        : basePrice;
    } else if (FAMILIAS_CON_PROMOCION.includes(item.product.familia_producto)) {
      // Para familias CRISTAL, usar precio base y aplicar 10% si hay 10+ cajas
      const basePrice = item.clientType === 'custab'
        ? item.product.neto_custab
        : item.product.neto_partner;
      
      const familyBoxes = boxesByFamily[item.product.familia_producto] || 0;
      finalPrice = familyBoxes >= 10 ? basePrice * 0.9 : basePrice;
    } else {
      // Para otras familias, usar el precio con promo si existe
      finalPrice = item.clientType === 'custab'
        ? (item.product.neto_promo_custab || item.product.neto_custab)
        : (item.product.neto_promo_partner || item.product.neto_partner);
    }
    
    return sum + (finalPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        boxesByFamily,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
