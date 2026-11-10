import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getOrders, getProducts, getSettings, money } from "@/lib/data";
import { ART_OPTIONS } from "@/components/DessertArt";
import Logo from "@/components/Logo";
import { deleteProduct, logout, saveProduct, saveSettings, setOrderStatus } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administración · La Casa del Postre" };

const TABS = [
  ["productos", "🍰 Productos"],
  ["pedidos", "📦 Pedidos"],
  ["ajustes", "⚙️ Yape y datos"],
] as const;

const STATUS_STYLE: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  pagado: "bg-green-100 text-green-700",
  entregado: "bg-sky-100 text-sky-700",
  cancelado: "bg-red-100 text-red-600",
};

function ProductForm({ p, categories }: { p?: Awaited<ReturnType<typeof getProducts>>[number]; categories: string[] }) {
  return (
    <form action={saveProduct} className="grid gap-3 sm:grid-cols-2">
      {p && <input type="hidden" name="id" value={p.id} />}
      <label className="text-sm font-bold">Nombre<input name="name" defaultValue={p?.name} required maxLength={80} className="input mt-1" /></label>
      <label className="text-sm font-bold">Precio (S/)<input name="price" type="number" step="0.5" min="0" defaultValue={p?.price} required className="input mt-1" /></label>
      <label className="text-sm font-bold sm:col-span-2">Descripción<textarea name="description" defaultValue={p?.description} rows={2} maxLength={300} className="input mt-1" /></label>
      <label className="text-sm font-bold">Categoría
        <input name="category" list="cats" defaultValue={p?.category ?? "Tortas"} className="input mt-1" />
        <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
      </label>
      <label className="text-sm font-bold">Ilustración
        <select name="art" defaultValue={p?.art ?? "chocolate"} className="input mt-1">
          {ART_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-bold sm:col-span-2">Foto propia (opcional, máx. 400 KB)
        <input name="image" type="file" accept="image/*" className="input mt-1" />
      </label>
      {p?.image && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="remove_image" /> Quitar la foto actual</label>}
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="available" defaultChecked={p?.available ?? true} className="h-5 w-5 accent-[#ec4f8b]" /> Disponible</label>
        <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="featured" defaultChecked={p?.featured} className="h-5 w-5 accent-[#ec4f8b]" /> Destacado en inicio</label>
        <button className="btn ml-auto !py-2">{p ? "Guardar cambios" : "Agregar producto"}</button>
      </div>
    </form>
  );
}

export default async function Admin({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  await requireAdmin();
  const { tab = "productos" } = await searchParams;
  const [products, orders, settings] = await Promise.all([getProducts(false), getOrders(), getSettings()]);
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const pending = orders.filter((o) => o.status === "pendiente").length;

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 py-6">
      <header className="card flex flex-wrap items-center gap-3 p-4">
        <Logo className="h-10 w-10" />
        <h1 className="font-script text-xl text-choco">Administración</h1>
        <Link href="/" className="ml-auto text-sm font-bold text-brand underline">Ver tienda</Link>
        <form action={logout}><button className="btn btn-ghost !py-1.5 text-sm">Salir</button></form>
      </header>

      <nav className="mt-4 flex flex-wrap gap-2">
        <Link href="/admin/recibos" className="rounded-full bg-white px-5 py-2 font-bold text-choco">🧾 Recibos</Link>
        {TABS.map(([k, label]) => (
          <Link key={k} href={`/admin?tab=${k}`} className={`rounded-full px-5 py-2 font-bold ${tab === k ? "bg-brand text-white" : "bg-white text-choco"}`}>
            {label}{k === "pedidos" && pending > 0 && <span className="ml-2 rounded-full bg-white px-2 text-xs text-brand">{pending}</span>}
          </Link>
        ))}
      </nav>

      {tab === "productos" && (
        <section className="mt-5 space-y-3">
          <details className="card p-4" open={products.length === 0}>
            <summary className="cursor-pointer font-bold text-brand-dark">➕ Nuevo producto</summary>
            <div className="mt-4"><ProductForm categories={categories} /></div>
          </details>
          {products.map((p) => (
            <details key={p.id} className="card p-4">
              <summary className="flex cursor-pointer flex-wrap items-center gap-3">
                <span className="font-bold text-choco">{p.name}</span>
                <span className="text-sm text-foreground/60">{p.category} · {money(p.price)}</span>
                {!p.available && <span className="rounded-full bg-red-100 px-2 text-xs font-bold text-red-600">Oculto</span>}
                {p.featured && <span className="rounded-full bg-soft px-2 text-xs font-bold text-brand">Destacado</span>}
              </summary>
              <div className="mt-4 space-y-3">
                <ProductForm p={p} categories={categories} />
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-sm font-bold text-red-600 underline">Eliminar producto</button>
                </form>
              </div>
            </details>
          ))}
        </section>
      )}

      {tab === "pedidos" && (
        <section className="mt-5 space-y-3">
          {orders.length === 0 && <p className="card p-6 text-center text-foreground/60">Aún no hay pedidos.</p>}
          {orders.map((o) => (
            <article key={o.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-choco">#{o.id} · {o.customer}</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                <span className="ml-auto text-xs text-foreground/50">{o.created_at} UTC</span>
              </div>
              <p className="text-sm">📞 <a className="underline" href={`https://wa.me/${o.phone.replace(/\D/g, "")}`}>{o.phone}</a></p>
              <ul className="mt-2 text-sm">
                {o.items.map((i) => <li key={i.id}>{i.qty} × {i.name} — {money(i.price * i.qty)}</li>)}
              </ul>
              {o.notes && <p className="mt-1 text-sm italic text-foreground/70">“{o.notes}”</p>}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <strong className="text-brand-dark">{money(o.total)}</strong>
                <a href={`/api/recibo/${o.id}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand underline">Recibo PDF</a>
                <form action={setOrderStatus} className="ml-auto flex flex-wrap gap-1">
                  <input type="hidden" name="id" value={o.id} />
                  {["pendiente", "pagado", "entregado", "cancelado"].map((s) => (
                    <button key={s} name="status" value={s} disabled={o.status === s} className="rounded-full bg-soft px-3 py-1 text-xs font-bold text-choco disabled:bg-brand disabled:text-white">{s}</button>
                  ))}
                </form>
              </div>
            </article>
          ))}
        </section>
      )}

      {tab === "ajustes" && (
        <form action={saveSettings} className="card mt-5 grid gap-4 p-5 sm:grid-cols-2">
          <h2 className="font-script text-2xl text-choco sm:col-span-2">Yape y datos de contacto</h2>
          <label className="text-sm font-bold">Número de Yape (9 dígitos)
            <input name="yape_number" defaultValue={settings.yape_number} inputMode="numeric" required className="input mt-1" />
          </label>
          <label className="text-sm font-bold">Nombre del titular
            <input name="yape_name" defaultValue={settings.yape_name} className="input mt-1" />
          </label>
          <label className="text-sm font-bold sm:col-span-2">QR real de Yape (opcional)
            <input name="yape_qr" type="file" accept="image/*" className="input mt-1" />
            <span className="mt-1 block font-normal text-foreground/60">En la app de Yape: “Mi QR” → captura y recorta. Si no subes nada, se genera un QR con el número.</span>
          </label>
          {settings.yape_qr && (
            <div className="flex items-center gap-3 sm:col-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={settings.yape_qr} alt="QR actual" className="h-24 w-24 rounded-xl border-2 border-soft" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="remove_qr" /> Quitar este QR</label>
            </div>
          )}
          <label className="text-sm font-bold">WhatsApp (con código, ej. 51987654321)
            <input name="whatsapp" defaultValue={settings.whatsapp} inputMode="numeric" required className="input mt-1" />
          </label>
          <label className="text-sm font-bold">Dirección
            <input name="address" defaultValue={settings.address} className="input mt-1" />
          </label>
          <label className="text-sm font-bold sm:col-span-2">Horario
            <input name="hours" defaultValue={settings.hours} className="input mt-1" />
          </label>
          <button className="btn sm:col-span-2">Guardar</button>
        </form>
      )}
    </div>
  );
}
