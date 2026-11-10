import Checkout from "@/components/Checkout";
import Reveal from "@/components/Reveal";
import { getSettings } from "@/lib/data";
import { yapeQr } from "@/lib/qr";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tu pedido · La Casa del Postre" };

export default async function Pedido() {
  const s = await getSettings();
  const qr = await yapeQr(s.yape_number, s.yape_qr);
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Reveal>
        <h1 className="mb-8 candy-title text-center font-script text-4xl sm:text-6xl">Tu pedido 🛍️</h1>
      </Reveal>
      <Checkout yapeNumber={s.yape_number} yapeName={s.yape_name} qr={qr} whatsapp={s.whatsapp} />
    </section>
  );
}
