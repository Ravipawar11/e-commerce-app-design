import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // [{ ...product, qty }]

  const addToCart = useCallback((product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...product, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems(prev =>
      prev
        .map(p => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
        .filter(p => p.qty > 0)
    );
  }, []);

  const increment = useCallback((id) => {
    setItems(prev =>
      prev.map(p => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );
  }, []);

  const decrement = useCallback((id) => {
    setItems(prev =>
      prev
        .map(p => (p.id === id ? { ...p, qty: p.qty - 1 } : p))
        .filter(p => p.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { totalItems, subtotal, savings } = useMemo(() => {
    const totalItems = items.reduce((s, p) => s + p.qty, 0);
    const subtotal = items.reduce((s, p) => s + p.price * p.qty, 0);
    const savings = items.reduce(
      (s, p) => s + (p.originalPrice - p.price) * p.qty,
      0
    );
    return { totalItems, subtotal, savings };
  }, [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    increment,
    decrement,
    clearCart,
    totalItems,
    subtotal,
    savings,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};