"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ usuario: "", password: "" });
  const [error, setError]     = useState(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/stock");
    } else {
      const data = await res.json();
      setError(data.error);
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Zeus" className="h-14 mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-white">Panel de administración</h1>
          <p className="text-gray-400 text-sm mt-1">Camisetas Zeus</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Usuario</label>
            <input
              type="text"
              value={form.usuario}
              onChange={(e) => setForm(p => ({ ...p, usuario: e.target.value }))}
              required
              autoComplete="username"
              className="bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
              required
              autoComplete="current-password"
              className="bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-orange-500 text-black font-bold py-3 rounded-xl hover:bg-orange-400 transition-colors disabled:opacity-50"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
