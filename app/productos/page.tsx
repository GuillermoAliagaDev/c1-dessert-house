import ProductsGrid from "@/components/ProductsGrid";
import Reveal from "@/components/Reveal";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Productos · La Casa del Postre" };

export default async function Productos() {
  const products = await getProducts();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Reveal>
        <h1 className="candy-title text-center font-script text-4xl sm:text-6xl">Nuestros Productos</h1>
        <p className="mt-1 mb-8 text-center font-hand text-2xl text-brand">elige tu antojo 🍓</p>
      </Reveal>
      <ProductsGrid products={products} />
    </section>
  );
}
