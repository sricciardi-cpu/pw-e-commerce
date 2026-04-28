-- ─── Tabla: productos en stock (envío inmediato) ─────────────────────────────
CREATE TABLE IF NOT EXISTS productos_stock (
  id          TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL,
  precio      INTEGER NOT NULL,
  categoria   TEXT NOT NULL CHECK (categoria IN ('local', 'alternativa', 'training')),
  tipo        TEXT NOT NULL CHECK (tipo IN ('nacion', 'club')),
  talle       TEXT[] NOT NULL DEFAULT '{}',
  descripcion TEXT,
  imagen      TEXT,
  imagen_espalda TEXT,
  stock       INTEGER NOT NULL DEFAULT 0,
  creado_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tabla: productos catálogo (por encargo) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS productos_catalogo (
  id          TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL,
  precio      INTEGER NOT NULL,
  categoria   TEXT NOT NULL CHECK (categoria IN ('local', 'alternativa', 'training')),
  tipo        TEXT NOT NULL CHECK (tipo IN ('nacion', 'club')),
  talle       TEXT[] NOT NULL DEFAULT '{}',
  descripcion TEXT,
  imagen      TEXT,
  imagen_espalda TEXT,
  stock       INTEGER NOT NULL DEFAULT 0,
  creado_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Función para descontar stock automáticamente al pagar ───────────────────
CREATE OR REPLACE FUNCTION decrementar_stock(producto_id TEXT, cantidad INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE productos_stock
  SET stock = GREATEST(0, stock - cantidad)
  WHERE id = producto_id;
END;
$$ LANGUAGE plpgsql;

-- ─── Acceso público de lectura (para el sitio) ───────────────────────────────
ALTER TABLE productos_stock   ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos_catalogo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lectura publica stock"
  ON productos_stock FOR SELECT USING (true);

CREATE POLICY "lectura publica catalogo"
  ON productos_catalogo FOR SELECT USING (true);

-- ─── Storage bucket para imágenes ────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "imagenes publicas"
  ON storage.objects FOR SELECT USING (bucket_id = 'productos');

CREATE POLICY "subida admin"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'productos');

CREATE POLICY "borrado admin"
  ON storage.objects FOR DELETE USING (bucket_id = 'productos');
