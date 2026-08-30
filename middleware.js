import { NextResponse } from "next/server";

// Comparación en tiempo constante para no filtrar información por timing.
function claveValida(recibida, esperada) {
  if (!recibida || !esperada || recibida.length !== esperada.length) return false;
  let diff = 0;
  for (let i = 0; i < recibida.length; i++) {
    diff |= recibida.charCodeAt(i) ^ esperada.charCodeAt(i);
  }
  return diff === 0;
}

// Endpoints que además del login del panel aceptan autenticación por API key
// (header x-api-key). Se limita a lecturas de pedidos: si la clave se filtra,
// no sirve para modificar ni borrar nada.
function permiteApiKey(pathname, method) {
  return pathname === "/api/admin/pedidos" && method === "GET";
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Login page y login/logout API son siempre accesibles
  if (
    pathname === "/admin" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  // Acceso por API key para automatizaciones externas (ej: Google Apps Script)
  if (permiteApiKey(pathname, request.method)) {
    const apiKey = request.headers.get("x-api-key");
    if (claveValida(apiKey, process.env.AUTOMATION_API_KEY)) {
      return NextResponse.next();
    }
  }

  const session = request.cookies.get("admin_session")?.value;
  const secret  = process.env.ADMIN_SESSION_SECRET;

  if (!session || !secret || session !== secret) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
