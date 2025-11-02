import React, { createContext, useState } from "react";

// Create the context
export const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Assign local unique ID (if not from DB)
      const itemWithId = {
        ...item,
        itemId: item._id || Date.now().toString(), // use Mongo ID if available, else local unique id
        quantity: 1,
      };
      return [...prev, itemWithId];
    });
  };

  // Remove item from cart
  const removeFromCart = (itemName) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.name === itemName ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const deleteFromCart = (itemName) => {
    setCartItems((prev) => prev.filter((item) => item.name !== itemName));
  };

  // Clear entire cart
  const clearCart = () => setCartItems([]);

  // User info state
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryTime: "10 mins",
  });

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        userInfo,
        setUserInfo,
        deleteFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook for using the cart context
export const useCart = () => React.useContext(CartContext);
