"use client";

import { useState, useEffect } from "react";
import { FaSpinner, FaChevronDown, FaChevronUp, FaBox, FaTimes } from "react-icons/fa";

const ESTADOS = ["pendiente_transferencia", "pagado", "enviado", "entregado", "cancelado"];

const badgeEstado = {
  pendiente:              "bg-zinc-700 text-gray-300",
  pendiente_transferencia:"bg-yellow-900/60 text-yellow-300",
  pagado:                 "bg-blue-900/60 text-blue-300",
  enviado:    "bg-orange-900/60 text-orange-300",
  entregado:  "bg-green-900/60 text-green-300",
  cancelado:  "bg-red-900/60 text-red-400",
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatearPrecio(n) {
  return "$" + Number(n).toLocaleString("es-AR");
}

function EstadoBadge({ estado }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${badgeEstado[estado] ?? "bg-zinc-700 text-gray-300"}`}>
      {estado}
    </span>
  );
}

function PedidoCard({ pedido, onEstadoChange, onEliminar }) {
  const [abierto,     setAbierto]     = useState(false);
  const [guardando,   setGuardando]   = useState(false);
  const [eliminando,  setEliminando]  = useState(false);
  const [estadoLocal, setEstadoLocal] = useState(pedido.estado);

  async function cambiarEstado(nuevoEstado) {
    if (nuevoEstado === estadoLocal) return;
    setGuardando(true);
    try {
      const res = await fetch(`/api/admin/pedidos/${pedido.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) {
        setEstadoLocal(nuevoEstado);
        onEstadoChange?.(pedido.id, nuevoEstado);
      }
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar(e) {
    e.stopPropagation();
    if (!confirm(`¿Eliminás el pedido de ${pedido.nombre ?? "este cliente"}? Esta acción no se puede deshacer.`)) return;
    setEliminando(true);
    try {
      const res = await fetch(`/api/admin/pedidos/${pedido.id}`, { method: "DELETE" });
      if (res.ok) onEliminar?.(pedido.id);
    } finally {
      setEliminando(false);
    }
  }

  const items = pedido.items ?? [];

  return (
    <article className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
      {/* Cabecera siempre visible */}
      <button
        className="w-full flex items-center gap-3 px-4 py-4 text-left"
        onClick={() => setAbierto(!abierto)}
      >
        <FaBox className="text-orange-500 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white text-sm truncate">{pedido.nombre ?? "—"}</span>
            <EstadoBadge estado={estadoLocal} />
            {(pedido.estado === "pendiente_transferencia" || pedido.metodo_pago === "transferencia") && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-900/50 text-green-400">
                Transferencia
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatearFecha(pedido.created_at)} · {items.length} artículo{items.length !== 1 ? "s" : ""} · <span className="text-orange-400 font-medium">{formatearPrecio(pedido.total)}</span>
          </p>
        </div>

        <button
          onClick={handleEliminar}
          disabled={eliminando}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-red-900/50 hover:text-red-400 transition-colors shrink-0 disabled:opacity-40"
          aria-label="Eliminar pedido"
        >
          {eliminando ? <FaSpinner className="animate-spin text-xs" /> : <FaTimes className="text-xs" />}
        </button>

        {abierto ? <FaChevronUp className="text-gray-400 shrink-0" /> : <FaChevronDown className="text-gray-400 shrink-0" />}
      </button>

      {/* Detalle expandible */}
      {abierto && (
        <div className="border-t border-zinc-700 px-4 pb-5 pt-4 flex flex-col gap-5">

          {/* Cambiar estado */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-1">Cambiar estado:</span>
            {ESTADOS.map((e) => (
              <button
                key={e}
                disabled={guardando || e === estadoLocal}
                onClick={() => cambiarEstado(e)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition-colors disabled:opacity-40 ${
                  e === estadoLocal
                    ? badgeEstado[e]
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                {guardando && e !== estadoLocal ? "..." : e}
              </button>
            ))}
          </div>

          {/* Datos del comprador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            <Info label="Email"    value={pedido.email} />
            <Info label="Teléfono" value={pedido.telefono} />
            <Info label="Dirección" value={[pedido.calle, pedido.numero, pedido.piso && `Piso ${pedido.piso}`, pedido.departamento].filter(Boolean).join(" ")} />
            <Info label="Localidad" value={[pedido.localidad, pedido.provincia].filter(Boolean).join(", ")} />
            <Info label="Cód. Postal" value={pedido.codigo_postal} />
            {pedido.payment_id && <Info label="Payment ID" value={pedido.payment_id} />}
            {pedido.observaciones && <Info label="Observaciones" value={pedido.observaciones} className="sm:col-span-2" />}
          </div>

          {/* Items */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Productos</p>
            <div className="flex flex-col gap-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-zinc-800 rounded-lg px-3 py-2">
                  {item.imagen && (
                    <img src={item.imagen} alt={item.nombre} className="w-10 h-10 object-contain rounded bg-white shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{item.nombre}</p>
                    <p className="text-xs text-gray-400">Talle {item.talle} · x{item.cantidad}</p>
                  </div>
                  <span className="text-orange-400 font-bold text-sm shrink-0">{formatearPrecio(item.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function Info({ label, value, className = "" }) {
  if (!value) return null;
  return (
    <div className={className}>
      <span className="text-xs text-gray-500">{label}: </span>
      <span className="text-xs text-gray-200">{value}</span>
    </div>
  );
}

export default function AdminPedidosPage() {
  const [pedidos,   setPedidos]   = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [filtro,    setFiltro]    = useState("todos");

  useEffect(() => {
    fetch("/api/admin/pedidos")
      .then((r) => r.json())
      .then((data) => { setPedidos(Array.isArray(data) ? data : []); setCargando(false); });
  }, []);

  function onEstadoChange(id, nuevoEstado) {
    setPedidos((prev) => prev.map((p) => p.id === id ? { ...p, estado: nuevoEstado } : p));
  }

  function onEliminar(id) {
    setPedidos((prev) => prev.filter((p) => p.id !== id));
  }

  const pedidosFiltrados = filtro === "todos"
    ? pedidos
    : pedidos.filter((p) => p.estado === filtro);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-white">Pedidos</h1>
        <span className="text-sm text-gray-400">{pedidos.length} total</span>
      </div>

      {/* Filtro por estado */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["todos", ...ESTADOS].map((e) => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition-colors ${
              filtro === e ? "bg-orange-500 text-black" : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="text-orange-500 text-3xl animate-spin" />
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <p className="text-center text-gray-400 py-20">
          {filtro === "todos" ? "No hay pedidos todavía." : `No hay pedidos con estado "${filtro}".`}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {pedidosFiltrados.map((p) => (
            <PedidoCard key={p.id} pedido={p} onEstadoChange={onEstadoChange} onEliminar={onEliminar} />
          ))}
        </div>
      )}
    </div>
  );
}
