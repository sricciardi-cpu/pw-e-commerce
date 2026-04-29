import MercadoPago, { Preference } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getPrecioEnvio() {
  try {
    const { data } = await supabaseAdmin()
      .from("configuracion")
      .select("valor")
      .eq("clave", "precio_envio")
      .single();
    return data ? parseInt(data.valor) || 0 : 0;
  } catch {
    return 0;
  }
}

export async function POST(request) {
  if (!process.env.MP_ACCESS_TOKEN) {
    return Response.json(
      { error: "El servicio de pagos aún no está configurado. Contactanos por WhatsApp." },
      { status: 503 }
    );
  }

  try {
    const { items, comprador } = await request.json();

    const precioEnvio = await getPrecioEnvio();
    const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0) + precioEnvio;

    // Guardar pedido en Supabase antes de redirigir a MP
    let pedidoId = null;
    try {
      const { data } = await supabaseAdmin()
        .from("pedidos")
        .insert({
          nombre:        comprador.nombre,
          email:         comprador.email,
          telefono:      `${comprador.codigoArea ?? ""}${comprador.celular ?? ""}`,
          provincia:     comprador.provincia ?? "",
          localidad:     comprador.localidad ?? "",
          calle:         comprador.calle ?? "",
          numero:        comprador.numero ?? "",
          piso:          comprador.piso ?? "",
          departamento:  comprador.departamento ?? "",
          codigo_postal: comprador.codigoPostal ?? "",
          observaciones: comprador.observaciones ?? "",
          items,
          total,
          estado: "pendiente",
        })
        .select("id")
        .single();
      pedidoId = data?.id ?? null;
    } catch (e) {
      console.error("Error saving pedido (no bloqueante):", e);
    }

    const client = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          ...items.map((item) => ({
            id: String(item.id),
            title: `${item.nombre} - Talle ${item.talle}`,
            quantity: item.cantidad,
            unit_price: item.precio,
            currency_id: "ARS",
            ...(item.imagen ? { picture_url: item.imagen } : {}),
          })),
          {
            id: "envio",
            title: "Envío",
            quantity: 1,
            unit_price: precioEnvio,
            currency_id: "ARS",
          },
        ],
        payer: {
          name: comprador.nombre,
          email: comprador.email,
          phone: { area_code: comprador.codigoArea || "", number: comprador.celular || "" },
          address: {
            street_name: comprador.calle || "",
            street_number: parseInt(comprador.numero) || 0,
            zip_code: comprador.codigoPostal || "",
          },
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/checkout/exito`,
          failure: `${process.env.NEXT_PUBLIC_URL}/checkout/error`,
          pending: `${process.env.NEXT_PUBLIC_URL}/checkout/exito`,
        },
        payment_methods: {
          excluded_payment_types: [
            { id: "ticket" },
            { id: "atm" },
          ],
          installments: 1,
        },
        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
        ...(pedidoId ? { external_reference: pedidoId } : {}),
      },
    });

    return Response.json({ url: result.init_point });
  } catch (err) {
    console.error("Error creando preferencia MP:", err);
    return Response.json({ error: "Error al iniciar el pago. Intentá de nuevo." }, { status: 500 });
  }
}
