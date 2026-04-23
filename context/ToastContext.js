"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-4 z-[200] flex flex-col gap-3 items-end pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium pointer-events-auto
              animate-[slideIn_0.3s_ease-out]
              ${toast.type === "success" ? "bg-black text-white" : "bg-red-600 text-white"}`}
          >
            {toast.type === "success"
              ? <FaCheckCircle className="text-orange-500 text-base shrink-0" />
              : <FaTimesCircle className="text-white text-base shrink-0" />
            }
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
