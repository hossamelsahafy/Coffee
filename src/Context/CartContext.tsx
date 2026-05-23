"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (
    product: any,
    selectedOption: any,
    quantity: number = 1,
  ) => {
    const cartItem = {
      productId: product.id,

      title: product.title,
      titleAr: product.titleAr,

      optionId: selectedOption.id,

      optionValue: selectedOption.value,
      optionValueAr: selectedOption.valueAr,

      price: selectedOption.priceAfter,

      image:
        selectedOption.ImageSource === "Url"
          ? selectedOption.imageUrl
          : selectedOption?.image?.url,

      quantity,
    };

    setCart((prev) => {
      const existingProduct = prev.find(
        (item) =>
          item.productId === cartItem.productId &&
          item.optionId === cartItem.optionId,
      );

      if (existingProduct) {
        return prev.map((item) =>
          item.productId === cartItem.productId &&
          item.optionId === cartItem.optionId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prev, cartItem];
    });
  };

  const removeFromCart = (productId: any, optionId: any) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.optionId === optionId),
      ),
    );
  };
  const increaseQuantity = (productId: any, optionId: any) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.optionId === optionId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };
  const decreaseQuantity = (productId: any, optionId: any) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.optionId === optionId
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item,
      ),
    );
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
