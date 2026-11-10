import Link from "next/link";
import Logo from "@/components/Logo";
import ReceiptsTable from "./components/ReceiptsTable";
import { listReceipts } from "./services/receiptService";

export default async function ReceiptsPage() {
  const receipts = await listReceipts();
  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 py-6">
      <header className="card flex flex-wrap items-center gap-3 p-4">
        <Logo className="h-10 w-10" />
        <h1 className="font-script text-xl text-choco">Recibos</h1>
        <Link href="/admin?tab=pedidos" className="ml-auto text-sm font-bold text-brand underline">← Volver al panel</Link>
      </header>
      <section className="mt-5">
        <ReceiptsTable receipts={receipts} />
      </section>
    </div>
  );
}
