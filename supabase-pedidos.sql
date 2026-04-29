-- ─── Tabla de pedidos ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
  id              UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id      TEXT,
  estado          TEXT    DEFAULT 'pendiente'
                          CHECK (estado IN ('pendiente','pagado','enviado','entregado','cancelado')),
  nombre          TEXT,
  email           TEXT,
  telefono        TEXT,
  provincia       TEXT,
  localidad       TEXT,
  calle           TEXT,
  numero          TEXT,
  piso            TEXT,
  departamento    TEXT,
  codigo_postal   TEXT,
  observaciones   TEXT,
  items           JSONB   NOT NULL DEFAULT '[]',
  total           NUMERIC NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all_pedidos" ON pedidos FOR ALL USING (true);

-- ─── Stock por talle en ambas tablas ─────────────────────────────────────────
ALTER TABLE productos_catalogo ADD COLUMN IF NOT EXISTS stock_por_talle JSONB DEFAULT '{}';
ALTER TABLE productos_stock    ADD COLUMN IF NOT EXISTS stock_por_talle JSONB DEFAULT '{}';

-- ─── RPC para descontar stock total + por talle ───────────────────────────────
CREATE OR REPLACE FUNCTION decrementar_stock_talle(
  p_tabla   TEXT,
  p_id      TEXT,
  p_talle   TEXT,
  p_cantidad INTEGER
)
RETURNS VOID AS $$
BEGIN
  IF p_tabla = 'productos_stock' THEN
    UPDATE productos_stock
    SET
      stock           = GREATEST(0, stock - p_cantidad),
      stock_por_talle = CASE
        WHEN stock_por_talle ? p_talle
        THEN jsonb_set(
               stock_por_talle,
               ARRAY[p_talle],
               to_jsonb(GREATEST(0, COALESCE((stock_por_talle->>p_talle)::int, 0) - p_cantidad))
             )
        ELSE stock_por_talle
      END
    WHERE id = p_id;

  ELSIF p_tabla = 'productos_catalogo' THEN
    UPDATE productos_catalogo
    SET
      stock           = GREATEST(0, stock - p_cantidad),
      stock_por_talle = CASE
        WHEN stock_por_talle ? p_talle
        THEN jsonb_set(
               stock_por_talle,
               ARRAY[p_talle],
               to_jsonb(GREATEST(0, COALESCE((stock_por_talle->>p_talle)::int, 0) - p_cantidad))
             )
        ELSE stock_por_talle
      END
    WHERE id = p_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
