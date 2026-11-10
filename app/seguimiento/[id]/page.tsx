import TrackingPage from "@/modules/receipts/TrackingPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Estado de tu pedido · La Casa del Postre", robots: { index: false } };

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ t?: string }> }) {
  const [{ id }, { t }] = await Promise.all([params, searchParams]);
  return <TrackingPage id={id} token={t ?? ""} />;
}
