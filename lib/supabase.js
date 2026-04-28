import { createClient } from "@supabase/supabase-js";

// Cliente público — usado en páginas del sitio (stock, catálogo)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL    ?? "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "placeholder"
);

// Cliente admin — usado solo en API routes del servidor (panel, webhook)
// Requiere SUPABASE_SERVICE_ROLE_KEY en .env.local
export function supabaseAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurada");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}
