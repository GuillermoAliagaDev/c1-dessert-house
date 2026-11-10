import type { Receipt, ReceiptStatus } from "../types/receiptTypes";

const STATUSES: ReceiptStatus[] = ["pendiente", "pagado", "entregado", "cancelado"];

export const receiptCode = (id: number) => `R-${String(id).padStart(6, "0")}`;

// SQLite guarda CURRENT_TIMESTAMP en UTC ("2026-10-24 21:00:25"); se muestra en hora de Lima.
export function formatDate(utc: string) {
  const d = new Date(utc.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return utc;
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Lima" }).format(d);
}

export function toReceipt(r: Record<string, unknown>): Receipt {
  const status = String(r.status) as ReceiptStatus;
  let items: Receipt["items"] = [];
  try {
    items = JSON.parse(String(r.items));
  } catch {}
  return {
    id: Number(r.id),
    code: receiptCode(Number(r.id)),
    customer: String(r.customer),
    phone: String(r.phone),
    notes: String(r.notes),
    items,
    total: Number(r.total),
    status: STATUSES.includes(status) ? status : "pendiente",
    createdAt: String(r.created_at),
    dateLabel: formatDate(String(r.created_at)),
    token: String(r.receipt_token ?? ""),
  };
}
