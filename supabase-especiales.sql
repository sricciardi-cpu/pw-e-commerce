-- Tabla para Mystery Futbox y Griptec Spray
CREATE TABLE IF NOT EXISTS paginas_especiales (
  id text PRIMARY KEY,
  nombre text NOT NULL DEFAULT '',
  precio integer NOT NULL DEFAULT 0,
  precio_original integer,
  descuento_label text,
  descripcion text NOT NULL DEFAULT '',
  imagen text NOT NULL DEFAULT '',
  packs jsonb
);

-- Datos iniciales
INSERT INTO paginas_especiales VALUES
(
  'mystery_futbox',
  'Mystery Futbox',
  50800,
  69980,
  '27% OFF',
  'Una caja sorpresa con una camiseta de fútbol o rugby a elección del equipo. Indicanos por WhatsApp el parche/estampado que querés.',
  '/mysteryfutbox.png',
  null
),
(
  'griptec_spray',
  'Griptec Spray 200ml',
  53000,
  null,
  null,
  'Spray de agarre instantáneo para rugby y fútbol. Mejora el grip en cualquier condición climática.',
  '/griptec.png',
  '[{"label":"1 unidad","precio":53000,"descuento":null},{"label":"Pack x2","precio":100700,"descuento":"5% OFF"},{"label":"Pack x3","precio":151000,"descuento":"5% OFF"},{"label":"Pack x12","precio":572400,"descuento":"10% OFF"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE paginas_especiales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read paginas_especiales"  ON paginas_especiales FOR SELECT USING (true);
CREATE POLICY "service role all paginas_especiales" ON paginas_especiales FOR ALL USING (auth.role() = 'service_role');

-- Columna destacado en productos_catalogo (para el carrusel del inicio)
ALTER TABLE productos_catalogo ADD COLUMN IF NOT EXISTS destacado boolean DEFAULT false;
