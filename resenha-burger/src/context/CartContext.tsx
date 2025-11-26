"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
};

export type CartItem = Product & {
  cartId: string;
  quantity: number;
  customizations: string[];
  unitPrice: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    customizations: string[],
    finalPrice: number
  ) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  editCartItem: (
    cartId: string,
    quantity: number,
    customizations: string[],
    newPrice: number
  ) => void;
  total: number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (
    product: Product,
    quantity: number,
    customizations: string[],
    finalPrice: number
  ) => {
    const newItem: CartItem = {
      ...product,
      cartId: `${product.id}-${Date.now()}`,
      quantity,
      customizations,
      unitPrice: finalPrice,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Nova função para editar um item já existente no carrinho
  const editCartItem = (
    cartId: string,
    newQuantity: number,
    newCustomizations: string[],
    newPrice: number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          return {
            ...item,
            quantity: newQuantity,
            customizations: newCustomizations,
            unitPrice: newPrice,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartId: string) => {
    setItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        editCartItem,
        total,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
