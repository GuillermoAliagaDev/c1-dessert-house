"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkCredentials, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const MAX_IMG = 400 * 1024;

async function fileToDataUrl(f: FormDataEntryValue | null): Promise<string | null> {
  if (!(f instanceof File) || f.size === 0) return null;
  if (!f.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen.");
  if (f.size > MAX_IMG) throw new Error("La imagen pesa más de 400 KB. Comprímela e inténtalo de nuevo.");
  return `data:${f.type};base64,${Buffer.from(await f.arrayBuffer()).toString("base64")}`;
}

export async function login(_: { error: string }, fd: FormData) {
  const ok = checkCredentials(String(fd.get("user") ?? ""), String(fd.get("password") ?? ""));
  if (!ok) return { error: "Usuario o contraseña incorrectos." };
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveProduct(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id") || 0);
  const name = String(fd.get("name") ?? "").trim().slice(0, 80);
  const price = Number(fd.get("price"));
  if (!name || !(price >= 0)) return;
  const description = String(fd.get("description") ?? "").trim().slice(0, 300);
  const category = String(fd.get("category") ?? "Tortas").trim().slice(0, 40) || "Tortas";
  const art = String(fd.get("art") ?? "chocolate");
  const available = fd.get("available") ? 1 : 0;
  const featured = fd.get("featured") ? 1 : 0;
  const upload = await fileToDataUrl(fd.get("image"));
  const removeImg = fd.get("remove_image") ? "" : null;
  const c = await db();

  if (id) {
    const image = upload ?? removeImg;
    await c.execute({
      sql: `UPDATE products SET name=?, description=?, price=?, category=?, art=?, available=?, featured=?${image !== null ? ", image=?" : ""} WHERE id=?`,
      args: image !== null
        ? [name, description, price, category, art, available, featured, image, id]
        : [name, description, price, category, art, available, featured, id],
    });
  } else {
    await c.execute({
      sql: "INSERT INTO products (name, description, price, category, art, image, available, featured) VALUES (?,?,?,?,?,?,?,?)",
      args: [name, description, price, category, art, upload ?? "", available, featured],
    });
  }
  revalidatePath("/admin");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  await (await db()).execute({ sql: "DELETE FROM products WHERE id=?", args: [Number(fd.get("id"))] });
  revalidatePath("/admin");
}

export async function setOrderStatus(fd: FormData) {
  await requireAdmin();
  const status = String(fd.get("status"));
  if (!["pendiente", "pagado", "entregado", "cancelado"].includes(status)) return;
  await (await db()).execute({ sql: "UPDATE orders SET status=? WHERE id=?", args: [status, Number(fd.get("id"))] });
  revalidatePath("/admin");
}

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const digits = (k: string) => String(fd.get(k) ?? "").replace(/\D/g, "");
  const entries: [string, string][] = [
    ["yape_number", digits("yape_number").slice(-9)],
    ["yape_name", String(fd.get("yape_name") ?? "").trim().slice(0, 60)],
    ["whatsapp", digits("whatsapp")],
    ["address", String(fd.get("address") ?? "").trim().slice(0, 120)],
    ["hours", String(fd.get("hours") ?? "").trim().slice(0, 120)],
  ];
  const qr = await fileToDataUrl(fd.get("yape_qr"));
  if (qr) entries.push(["yape_qr", qr]);
  if (fd.get("remove_qr")) entries.push(["yape_qr", ""]);
  const c = await db();
  await c.batch(
    entries
      .filter(([k, v]) => v !== "" || k === "yape_qr" || k === "address" || k === "hours")
      .map(([k, v]) => ({ sql: "INSERT INTO settings (key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", args: [k, v] })),
    "write",
  );
  revalidatePath("/admin");
}
