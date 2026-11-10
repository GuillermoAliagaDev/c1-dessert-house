import { notFound } from "next/navigation";
import OrderStatusTracker from "./components/OrderStatusTracker";
import { findReceipt, getShopInfo, tokenMatches } from "./services/receiptService";

export default async function TrackingPage({ id, token }: { id: string; token: string }) {
  const receipt = Number.isInteger(Number(id)) ? await findReceipt(Number(id)) : null;
  if (!receipt || !tokenMatches(receipt, token)) notFound();
  const shop = await getShopInfo();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <OrderStatusTracker receipt={receipt} token={token} whatsapp={shop.whatsapp} />
    </section>
  );
}
