import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);

  /* ADD TO CART */

  const addToCart = (product) => {

  setCartItems((prev) => {

    const existing = prev.find((item) => item.id === product.id);

    const quantityToAdd = product.quantity || 1;

    if (existing) {

      const newQty = existing.quantity + quantityToAdd;

      if (newQty > existing.stock) {
        alert(`Only ${existing.stock} items available in stock`);
        return prev;
      }

      return prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity: newQty }
          : item
      );
    }

    // NORMALIZE PRODUCT HERE
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || [],
      quantity: quantityToAdd,
      stock: product.stock || 0, 
      color: product.color || null,
      size: product.size || null,
    };

    if (newItem.quantity > newItem.stock) {
      alert(`Only ${newItem.stock} items available in stock`);
      return prev;
    }

    return [...prev, newItem];

  });

};


  /* INCREASE QTY */

  const increaseQty = (id) => {

    setCartItems((prev) =>
      prev.map((item) => {

        if (item.id === id) {

          if (item.quantity >= item.stock) {
            alert(`Maximum stock reached (${item.stock})`);
            return item;
          }

          return { ...item, quantity: item.quantity + 1 };
        }

        return item;

      })
    );

  };


  /* DECREASE QTY */

  const decreaseQty = (id) => {

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

  };


  /* REMOVE ITEM */

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };


  /* CLEAR CART (ADD THIS) */

  const clearCart = () => {
    setCartItems([]);
  };


  /* TOTAL ITEMS */

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,  
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );

}