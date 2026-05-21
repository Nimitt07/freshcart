import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [user]);

  async function refreshCart() {
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId, quantity = 1) {
    const { data } = await api.post('/cart', { productId, quantity });
    setCart(data);
  }

  async function updateQuantity(itemId, quantity) {
    const { data } = await api.patch(`/cart/${itemId}`, { quantity });
    setCart(data);
  }

  async function removeItem(itemId) {
    const { data } = await api.delete(`/cart/${itemId}`);
    setCart(data);
  }

  const value = useMemo(
    () => ({
      cart,
      loading,
      count: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      setCart
    }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
