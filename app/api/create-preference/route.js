export const dynamic = "force-dynamic";

import MercadoPago, { Preference } from "mercadopago";

const ENVIO_FIJO = 9;

export async function POST(request) {
  if (!process.env.MP_ACCESS_TOKEN) {
    return Response.json(
      { error: "El servicio de pagos aún no está configurado. Contactanos por WhatsApp." },
      { status: 503 }
    );
  }

  try {
    const { items, comprador } = await request.json();

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
            unit_price: ENVIO_FIJO,
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
        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
      },
    });

    return Response.json({ url: result.init_point });
  } catch (err) {
    console.error("Error creando preferencia MP:", err);
    return Response.json({ error: "Error al iniciar el pago. Intentá de nuevo." }, { status: 500 });
  }
}
