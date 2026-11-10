import { requireAdmin } from "@/lib/auth";
import ReceiptsPage from "@/modules/receipts/ReceiptsPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Recibos · Administración" };

export default async function Page() {
  await requireAdmin();
  return <ReceiptsPage />;
}
