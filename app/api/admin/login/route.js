import { cookies } from "next/headers";

export async function POST(request) {
  const { usuario, password } = await request.json();

  if (
    usuario !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return Response.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  cookies().set("admin_session", process.env.ADMIN_SESSION_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });

  return Response.json({ ok: true });
}
