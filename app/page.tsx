import Link from "next/link";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import HeroArt from "@/components/HeroArt";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

const STEPS = [
  { icon: "🍰", title: "Elige tus postres", text: "Mira el menú y agrega lo que se te antoje al pedido." },
  { icon: "📱", title: "Paga con Yape", text: "Escanea el QR o yapea al número. Es rápido y seguro." },
  { icon: "💗", title: "Disfruta", text: "Confirmamos por WhatsApp y te lo preparamos con cariño." },
];

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-2 md:pt-16">
        <div>
          <Reveal>
            <p className="candy-text font-hand text-4xl font-bold">Bienvenidos a</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="candy-title mt-1 font-script text-5xl leading-tight sm:text-7xl">La Casa del Postre</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-md text-lg text-foreground/75">
              Postres que hacen la vida más dulce. Tortas, cheesecakes y cuchareables hechos con amor. Pide en línea y paga con Yape.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-7 flex flex-wrap gap-3">
            <Link href="/productos" className="btn">Ver productos →</Link>
            <Link href="/contacto" className="btn btn-ghost">Conócenos</Link>
          </Reveal>
        </div>
        <HeroArt />
      </section>

      <Marquee />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="candy-title text-center font-script text-4xl sm:text-5xl">Los favoritos</h2>
          <p className="mt-1 text-center font-hand text-2xl text-brand">los que más piden 💗</p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link href="/productos" className="btn btn-ghost">Ver todo el menú</Link>
        </Reveal>
      </section>

      <div className="stripe-bar" />
      <section className="bg-dots bg-white/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="candy-title text-center font-script text-4xl sm:text-5xl">¿Cómo pedir?</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.12}>
                <div className="card h-full p-6 text-center transition-transform hover:-translate-y-2">
                  <div className="mx-auto grid h-16 w-16 animate-jelly place-items-center rounded-full bg-soft text-3xl">{s.icon}</div>
                  <h3 className="mt-4 text-xl font-bold text-choco">{i + 1}. {s.title}</h3>
                  <p className="mt-2 text-foreground/70">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <div className="stripe-bar" />
    </>
  );
}
