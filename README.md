# La Casa del Postre 🍰

Tienda de postres hecha con **Next.js 16**, **Tailwind**, **Framer Motion** y **Turso (SQLite gratis)**.
Incluye carrito, pago con **Yape (QR + número)** y panel de administración.

## Correr en local

```bash
npm install
cp .env.example .env.local   # ya existe; cambia ADMIN_PASSWORD
npm run dev
```

Sin configurar nada, usa un archivo `local.db` (se crea y se llena solo con los postres).
Panel: http://localhost:3000/admin  (usuario/clave de `.env.local`).

## Subir a Vercel (gratis)

1. Crea la base en [turso.tech](https://turso.tech) (plan gratis, sin tarjeta):
   ```bash
   turso db create casa-del-postre
   turso db show casa-del-postre --url          # -> TURSO_DATABASE_URL
   turso db tokens create casa-del-postre       # -> TURSO_AUTH_TOKEN
   ```
2. Sube el proyecto a GitHub e impórtalo en [vercel.com/new](https://vercel.com/new).
3. En *Settings → Environment Variables* agrega: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`,
   `ADMIN_USER`, `ADMIN_PASSWORD`, `AUTH_SECRET` (`openssl rand -base64 32`).
4. Deploy. Las tablas y los postres iniciales se crean solos en la primera visita.

## Yape

En `/admin → Yape y datos` pones el número de tu amigo/a, el nombre y el WhatsApp.
Yape no tiene API pública para cobrar con monto, así que: el cliente escanea el QR (o yapea al número),
y luego te manda la captura por WhatsApp (el botón ya trae el mensaje con el # de pedido y el monto).
Para que el QR sea el oficial, sube la captura de "Mi QR" desde la app de Yape; si no, se genera un QR con el número.
Cuando verifiques el pago, marca el pedido como **pagado** en `/admin → Pedidos`.

## Recibos en PDF

- Al confirmar un pedido, el cliente ve el botón **Descargar recibo (PDF)**. El link lleva un código privado
  (`/api/recibo/<id>?t=<código>`), así nadie puede ver recibos ajenos probando números.
- El admin ve todos los recibos en `/admin/recibos` (buscar, filtrar por estado, ver o descargar el PDF).
  Con la sesión de admin el PDF abre sin código.
- Los PDF se generan al momento con `pdf-lib`, no se guardan en ningún lado. Los pedidos hechos antes de esta
  función no tienen código, así que solo el admin puede abrir su recibo.

## Seguimiento del pedido

Después de pedir, el cliente ve **Ver el estado de mi pedido** (`/seguimiento/<id>?t=<código>`): una página
con los pasos *recibido → pago confirmado → entregado* que se actualiza sola cada 15 s. Cuando el admin
cambia el estado en `/admin`, el cliente lo ve ahí. Los últimos 5 pedidos del navegador quedan guardados
y aparecen en `/pedido` cuando el carrito está vacío.
