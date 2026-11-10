import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let ready: Promise<void> | null = null;

function getClient() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL || "file:local.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

const SEED = [
  ["Torta de chocolate", "Bizcocho húmedo de cacao con ganache y crema de chocolate.", 45, "Tortas", "chocolate", 1],
  ["Torta de tres leches", "Esponjosa, bañada en tres leches y coronada con crema chantilly.", 42, "Tortas", "tresleches", 1],
  ["Cheesecake de maracuyá", "Base crocante, crema suave y topping de maracuyá fresco.", 40, "Cheesecakes", "cheese-maracuya", 1],
  ["Cheesecake de frutos rojos", "Cremoso, con salsa de fresas, arándanos y frambuesas.", 40, "Cheesecakes", "cheese-frutos", 1],
  ["Cheesecake de Oreo", "Base de galleta Oreo, crema y trocitos de galleta por encima.", 40, "Cheesecakes", "cheese-oreo", 0],
  ["Cuchareable de alfajores", "Capas de alfajor, manjar blanco y crema en vasito.", 10, "Cuchareables", "alfajor-cup", 1],
  ["Keke de vainilla", "Keke casero esponjoso con aroma a vainilla.", 18, "Kekes", "keke", 0],
  ["Keke de zanahoria", "Keke húmedo con zanahoria rallada, canela y nueces.", 20, "Kekes", "zanahoria", 0],
  ["Mazamorra morada", "Postre tradicional peruano de maíz morado, frutas y canela.", 8, "Tradicionales", "mazamorra", 0],
] as const;

const SETTINGS: Record<string, string> = {
  yape_number: "999999999",
  yape_name: "La Casa del Postre",
  yape_qr: "",
  whatsapp: "51999999999",
  address: "Piura, Perú",
  hours: "Lun - Sáb: 9:00 am - 7:00 pm",
};

async function init() {
  const c = getClient();
  await c.batch(
    [
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        price REAL NOT NULL,
        category TEXT NOT NULL DEFAULT 'Tortas',
        art TEXT NOT NULL DEFAULT 'chocolate',
        image TEXT NOT NULL DEFAULT '',
        available INTEGER NOT NULL DEFAULT 1,
        featured INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer TEXT NOT NULL,
        phone TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT '',
        items TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendiente',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
    ],
    "write",
  );
  // Bases creadas antes de los recibos no tienen esta columna.
  const cols = await c.execute("PRAGMA table_info(orders)");
  if (!cols.rows.some((r) => r.name === "receipt_token")) {
    await c.execute("ALTER TABLE orders ADD COLUMN receipt_token TEXT NOT NULL DEFAULT ''");
  }
  const count = await c.execute("SELECT COUNT(*) AS n FROM products");
  if (Number(count.rows[0].n) === 0) {
    await c.batch(
      SEED.map((args) => ({
        sql: "INSERT INTO products (name, description, price, category, art, featured) VALUES (?,?,?,?,?,?)",
        args: [...args],
      })),
      "write",
    );
  }
  await c.batch(
    Object.entries(SETTINGS).map(([k, v]) => ({
      sql: "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
      args: [k, v],
    })),
    "write",
  );
}

export async function db() {
  ready ??= init().catch((e) => {
    ready = null;
    throw e;
  });
  await ready;
  return getClient();
}
