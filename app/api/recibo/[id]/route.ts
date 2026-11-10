import { isAdmin } from "@/lib/auth";
import { findReceipt, getShopInfo, tokenMatches } from "@/modules/receipts/services/receiptService";
import { buildReceiptPdf } from "@/modules/receipts/services/receiptPdfService";

// El cliente entra con ?t=<token> (link privado que recibe al hacer el pedido); el admin, con su sesión.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const receipt = Number.isInteger(Number(id)) ? await findReceipt(Number(id)) : null;
  const allowed = receipt && ((await isAdmin()) || tokenMatches(receipt, url.searchParams.get("t") ?? ""));
  if (!receipt || !allowed) return new Response("Recibo no encontrado", { status: 404 });

  const pdf = await buildReceiptPdf(receipt, await getShopInfo());
  const disposition = url.searchParams.get("download") ? "attachment" : "inline";
  return new Response(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="recibo-${receipt.code}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
