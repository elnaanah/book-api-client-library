
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Book } from '@/types/api';
import { toast } from '@/hooks/use-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (book: Book, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.book._id === book._id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > book.quantity) {
          toast({
            title: "تنبيه",
            description: `الكمية المتاحة من هذا الكتاب هي ${book.quantity} فقط`,
            variant: "destructive",
          });
          return prevCart;
        }
        
        toast({
          title: "تم التحديث",
          description: `تم تحديث كمية "${book.title}" في السلة`,
        });
        
        return prevCart.map(item =>
          item.book._id === book._id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantity > book.quantity) {
          toast({
            title: "تنبيه",
            description: `الكمية المتاحة من هذا الكتاب هي ${book.quantity} فقط`,
            variant: "destructive",
          });
          return prevCart;
        }
        
        toast({
          title: "تمت الإضافة",
          description: `تم إضافة "${book.title}" إلى السلة`,
        });
        
        return [...prevCart, { book, quantity }];
      }
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.book._id === bookId);
      if (item) {
        toast({
          title: "تم الحذف",
          description: `تم حذف "${item.book.title}" من السلة`,
        });
      }
      return prevCart.filter(item => item.book._id !== bookId);
    });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.book._id === bookId) {
          if (quantity > item.book.quantity) {
            toast({
              title: "تنبيه",
              description: `الكمية المتاحة من هذا الكتاب هي ${item.book.quantity} فقط`,
              variant: "destructive",
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "تم مسح السلة",
      description: "تم مسح جميع العناصر من السلة",
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
