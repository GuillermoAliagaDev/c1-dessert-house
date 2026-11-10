import Reveal from "@/components/Reveal";
import DessertArt from "@/components/DessertArt";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contacto y nosotros · La Casa del Postre" };

export default async function Contacto() {
  const s = await getSettings();
  const wa = s.whatsapp;
  const pretty = wa.startsWith("51") ? `+51 ${wa.slice(2, 5)} ${wa.slice(5, 8)} ${wa.slice(8)}` : wa;
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2">
      <Reveal>
        <div className="card h-full p-6">
          <h2 className="font-script text-3xl text-choco">Contáctanos 💗</h2>
          <ul className="mt-6 space-y-5">
            <li className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25d366] text-2xl">💬</span>
              <div className="flex-1"><p className="font-bold">WhatsApp</p><p className="text-foreground/70">{pretty}</p></div>
              <a className="btn !px-4 !py-2 text-sm" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">Escribir</a>
            </li>
            <li className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-soft text-2xl">📍</span>
              <div><p className="font-bold">Ubicación</p><p className="text-foreground/70">{s.address}</p></div>
            </li>
            <li className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-soft text-2xl">🕒</span>
              <div><p className="font-bold">Horario de atención</p><p className="text-foreground/70">{s.hours}</p></div>
            </li>
          </ul>
          <p className="mt-8 font-hand text-2xl text-brand">¡Te esperamos!</p>
        </div>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="card relative h-full overflow-hidden p-6">
          <h2 className="font-script text-3xl text-choco">Sobre nosotros 🍰</h2>
          <p className="mt-4 max-w-sm text-foreground/75">
            Somos un pequeño emprendimiento con un gran sueño: endulzar tus momentos especiales. Preparamos cada postre con mucho amor, ingredientes de calidad y toda la dedicación que se merece.
          </p>
          <p className="mt-4 font-script text-xl text-brand">La Casa del Postre</p>
          <p className="font-hand text-xl text-choco">Más que postres, son momentos</p>
          <DessertArt art="cheese-frutos" className="animate-float absolute -bottom-6 -right-6 w-48 opacity-95" />
        </div>
      </Reveal>
    </section>
  );
}
