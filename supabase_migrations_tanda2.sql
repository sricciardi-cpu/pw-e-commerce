-- ============================================================
-- TANDA 2 — Correr en Supabase SQL Editor
-- ============================================================

-- 1. Descuento por transferencia por producto
ALTER TABLE productos_catalogo ADD COLUMN IF NOT EXISTS descuento_transferencia integer DEFAULT 0;
ALTER TABLE productos_stock    ADD COLUMN IF NOT EXISTS descuento_transferencia integer DEFAULT 0;

-- 2. Tabla de configuración (precio de envío, etc.)
CREATE TABLE IF NOT EXISTS configuracion (
  clave text PRIMARY KEY,
  valor text NOT NULL
);
INSERT INTO configuracion (clave, valor) VALUES ('precio_envio', '9000')
  ON CONFLICT (clave) DO NOTHING;

-- 3. Método de pago en pedidos (para distinguir transferencia vs MP)
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS metodo_pago text DEFAULT 'mercadopago';
