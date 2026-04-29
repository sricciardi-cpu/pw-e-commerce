"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function agregarAlCarrito({ id, nombre, talle, precio, cantidad = 1, imagen = null, stock = Infinity }) {
    setItems((prev) => {
      const existe = prev.find((i) => i.id === id && i.talle === talle);
      if (existe) {
        const nuevaCantidad = Math.min(existe.cantidad + cantidad, stock);
        if (nuevaCantidad === existe.cantidad) return prev; // ya está al límite
        return prev.map((i) =>
          i.id === id && i.talle === talle ? { ...i, cantidad: nuevaCantidad, stock } : i
        );
      }
      return [...prev, { id, nombre, talle, precio, cantidad: Math.min(cantidad, stock), imagen, stock }];
    });
  }

  function cantidadEnCarrito(id, talle) {
    return items.find((i) => i.id === id && i.talle === talle)?.cantidad ?? 0;
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
    <CartContext.Provider value={{ items, agregarAlCarrito, quitarDelCarrito, vaciarCarrito, total, cantidadTotal, cantidadEnCarrito }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook para consumir el contexto en cualquier componente cliente
export function useCart() {
  return useContext(CartContext);
}
