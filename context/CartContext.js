"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Agrega un item; si ya existe el mismo id+talle incrementa cantidad
  function agregarAlCarrito({ id, nombre, talle, precio, cantidad = 1, imagen = null }) {
    setItems((prev) => {
      const existe = prev.find((i) => i.id === id && i.talle === talle);
      if (existe) {
        return prev.map((i) =>
          i.id === id && i.talle === talle
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { id, nombre, talle, precio, cantidad, imagen }];
    });
  }

  // Elimina completamente un item por id + talle
  function quitarDelCarrito(id, talle) {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.talle === talle)));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, agregarAlCarrito, quitarDelCarrito, vaciarCarrito, total, cantidadTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook para consumir el contexto en cualquier componente cliente
export function useCart() {
  return useContext(CartContext);
}
