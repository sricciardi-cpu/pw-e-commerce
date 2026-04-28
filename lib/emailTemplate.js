function formatearPrecio(precio) {
  return "$" + Number(precio).toLocaleString("es-AR");
}

export function emailConfirmacionCompra({ comprador, items, total, envio, paymentId }) {
  const totalConEnvio = total + envio;

  const filasItems = items
    .filter((i) => i.id !== "envio")
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #27272a; vertical-align: middle;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              ${
                item.picture_url
                  ? `<td width="60" style="padding-right: 14px; vertical-align: middle;">
                      <img src="${item.picture_url}" width="60" height="60"
                        style="border-radius: 8px; background:#fff; display:block; object-fit:contain;" />
                    </td>`
                  : ""
              }
              <td style="vertical-align: middle;">
                <p style="margin:0; color:#ffffff; font-weight:600; font-size:14px;">${item.title}</p>
                <p style="margin:4px 0 0; color:#a1a1aa; font-size:13px;">Cantidad: ${item.quantity}</p>
              </td>
              <td align="right" style="vertical-align: middle; white-space: nowrap;">
                <p style="margin:0; color:#f97316; font-weight:700; font-size:15px;">
                  ${formatearPrecio(item.unit_price * item.quantity)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de compra — Zeus Rugby</title>
</head>
<body style="margin:0; padding:0; background-color:#09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#09090b; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#18181b; border-radius:16px 16px 0 0; padding: 28px 32px; border-bottom: 2px solid #f97316;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0; font-size:22px; font-weight:800; color:#ffffff; letter-spacing:-0.5px;">
                      ⚡ Zeus Rugby
                    </p>
                    <p style="margin:6px 0 0; font-size:13px; color:#a1a1aa;">Camisetas de rugby de alta calidad</p>
                  </td>
                  <td align="right">
                    <span style="background-color:#16a34a; color:#ffffff; font-size:12px; font-weight:700; padding:6px 14px; border-radius:20px;">
                      ✓ Pago confirmado
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td style="background-color:#18181b; padding: 28px 32px 0;">
              <h1 style="margin:0; font-size:24px; font-weight:800; color:#ffffff;">
                ¡Gracias por tu compra, ${comprador.nombre}!
              </h1>
              <p style="margin:10px 0 0; font-size:14px; color:#a1a1aa; line-height:1.6;">
                Recibimos tu pago correctamente. En breve nos ponemos en contacto para coordinar el envío.
              </p>
              ${paymentId ? `<p style="margin:8px 0 0; font-size:12px; color:#71717a;">Nº de pago: <span style="color:#f97316;">${paymentId}</span></p>` : ""}
            </td>
          </tr>

          <!-- Productos -->
          <tr>
            <td style="background-color:#18181b; padding: 24px 32px 0;">
              <p style="margin:0 0 12px; font-size:16px; font-weight:700; color:#ffffff;">Tu pedido</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${filasItems}
              </table>
            </td>
          </tr>

          <!-- Totales -->
          <tr>
            <td style="background-color:#18181b; padding: 16px 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; border-top: 1px solid #27272a;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#a1a1aa; font-size:14px;">Subtotal</td>
                        <td align="right" style="color:#a1a1aa; font-size:14px;">${formatearPrecio(total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#a1a1aa; font-size:14px;">Envío</td>
                        <td align="right" style="color:#a1a1aa; font-size:14px;">${formatearPrecio(envio)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-top: 1px solid #3f3f46;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#ffffff; font-size:16px; font-weight:700;">Total pagado</td>
                        <td align="right" style="color:#f97316; font-size:18px; font-weight:800;">${formatearPrecio(totalConEnvio)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dirección de envío -->
          ${
            comprador.calle
              ? `<tr>
            <td style="background-color:#18181b; padding: 0 32px;">
              <div style="background-color:#27272a; border-radius:10px; padding:16px; margin-bottom:4px;">
                <p style="margin:0 0 6px; font-size:13px; font-weight:600; color:#f97316; text-transform:uppercase; letter-spacing:0.5px;">📦 Dirección de envío</p>
                <p style="margin:0; font-size:14px; color:#d4d4d8; line-height:1.6;">
                  ${comprador.calle} ${comprador.numero}${comprador.piso ? `, Piso ${comprador.piso}` : ""}${comprador.departamento ? ` Dto. ${comprador.departamento}` : ""}<br/>
                  ${comprador.localidad}, ${comprador.provincia} (CP ${comprador.codigoPostal})
                </p>
                ${comprador.observaciones ? `<p style="margin:8px 0 0; font-size:13px; color:#a1a1aa;">Obs: ${comprador.observaciones}</p>` : ""}
              </div>
            </td>
          </tr>`
              : ""
          }

          <!-- Contacto -->
          <tr>
            <td style="background-color:#18181b; padding: 20px 32px 28px;">
              <p style="margin:0; font-size:13px; color:#71717a; line-height:1.6;">
                ¿Tenés dudas? Escribinos por WhatsApp o respondé este mail.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#09090b; border-radius: 0 0 16px 16px; padding: 20px 32px; text-align:center; border-top: 1px solid #27272a;">
              <p style="margin:0; font-size:12px; color:#52525b;">
                Zeus Rugby · Buenos Aires, Argentina
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
