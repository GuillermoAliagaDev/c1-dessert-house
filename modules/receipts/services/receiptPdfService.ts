import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { Receipt, ShopInfo } from "../types/receiptTypes";

const PINK = rgb(0.925, 0.31, 0.545);
const PINK_SOFT = rgb(1, 0.878, 0.918);
const CHOCO = rgb(0.357, 0.184, 0.122);
const GRAY = rgb(0.45, 0.35, 0.4);
const CANDY = [rgb(1, 0.3, 0.55), rgb(1, 0.62, 0.11), rgb(1, 0.82, 0.25), rgb(0.24, 0.86, 0.59), rgb(0.21, 0.72, 1), rgb(0.65, 0.42, 1)];

const STATUS_LABEL: Record<Receipt["status"], { text: string; color: ReturnType<typeof rgb> }> = {
  pendiente: { text: "PENDIENTE DE PAGO", color: rgb(0.85, 0.55, 0.05) },
  pagado: { text: "PAGADO", color: rgb(0.1, 0.6, 0.3) },
  entregado: { text: "ENTREGADO", color: rgb(0.1, 0.5, 0.8) },
  cancelado: { text: "CANCELADO", color: rgb(0.8, 0.2, 0.2) },
};

// Las fuentes estándar del PDF solo admiten Latin-1: emojis y otros símbolos se reemplazan.
const clean = (t: string) => t.replace(/[^ -~ -ÿ]/gu, "?");
const money = (n: number) => `S/ ${n.toFixed(2)}`;

function fit(text: string, font: PDFFont, size: number, max: number) {
  let t = clean(text);
  if (font.widthOfTextAtSize(t, size) <= max) return t;
  while (t.length > 1 && font.widthOfTextAtSize(t + "...", size) > max) t = t.slice(0, -1);
  return t + "...";
}

function wrap(text: string, font: PDFFont, size: number, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const w of clean(text).split(/\s+/)) {
    const next = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) > max && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

export async function buildReceiptPdf(r: Receipt, shop: ShopInfo): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Recibo ${r.code} - ${shop.name}`);
  pdf.setAuthor(shop.name);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const W = 420;
  const M = 32;
  const noteLines = r.notes ? wrap(r.notes, font, 9, W - M * 2) : [];
  const H = 470 + r.items.length * 24 + noteLines.length * 12;
  const page = pdf.addPage([W, H]);
  const top = (y: number) => H - y; // coordenadas medidas desde arriba

  // Cabecera
  page.drawRectangle({ x: 0, y: top(96), width: W, height: 96, color: PINK });
  page.drawRectangle({ x: 0, y: top(104), width: W, height: 8, color: PINK_SOFT });
  // cupcake
  page.drawRectangle({ x: M, y: top(70), width: 30, height: 20, color: rgb(1, 1, 1) });
  page.drawCircle({ x: M + 15, y: top(42), size: 17, color: PINK_SOFT });
  page.drawCircle({ x: M + 15, y: top(24), size: 4.5, color: CANDY[0] });
  page.drawText(clean(shop.name), { x: M + 46, y: top(46), size: 19, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Recibo de compra", { x: M + 46, y: top(64), size: 10, font, color: rgb(1, 1, 1) });
  const codeW = bold.widthOfTextAtSize(r.code, 14);
  page.drawText(r.code, { x: W - M - codeW, y: top(46), size: 14, font: bold, color: rgb(1, 1, 1) });
  const dateW = font.widthOfTextAtSize(clean(r.dateLabel), 9);
  page.drawText(clean(r.dateLabel), { x: W - M - dateW, y: top(64), size: 9, font, color: rgb(1, 1, 1) });

  // Cliente
  let y = 134;
  page.drawText("CLIENTE", { x: M, y: top(y), size: 8, font: bold, color: PINK });
  page.drawText(fit(r.customer, bold, 13, W - M * 2), { x: M, y: top(y + 16), size: 13, font: bold, color: CHOCO });
  page.drawText(`Celular: ${clean(r.phone)}`, { x: M, y: top(y + 31), size: 10, font, color: GRAY });
  y += 62;

  // Tabla
  page.drawRectangle({ x: M, y: top(y + 8), width: W - M * 2, height: 24, color: PINK_SOFT });
  const colQty = M + 8;
  const colName = M + 40;
  const colPrice = W - M - 120;
  const colSub = W - M - 8;
  page.drawText("CANT.", { x: colQty, y: top(y), size: 8, font: bold, color: CHOCO });
  page.drawText("PRODUCTO", { x: colName, y: top(y), size: 8, font: bold, color: CHOCO });
  page.drawText("P. UNIT.", { x: colPrice, y: top(y), size: 8, font: bold, color: CHOCO });
  const subHead = "SUBTOTAL";
  page.drawText(subHead, { x: colSub - bold.widthOfTextAtSize(subHead, 8), y: top(y), size: 8, font: bold, color: CHOCO });
  y += 28;
  for (const it of r.items) {
    page.drawText(String(it.qty), { x: colQty + 6, y: top(y), size: 10, font, color: CHOCO });
    page.drawText(fit(it.name, font, 10, colPrice - colName - 8), { x: colName, y: top(y), size: 10, font, color: CHOCO });
    page.drawText(money(it.price), { x: colPrice, y: top(y), size: 10, font, color: GRAY });
    const sub = money(it.price * it.qty);
    page.drawText(sub, { x: colSub - font.widthOfTextAtSize(sub, 10), y: top(y), size: 10, font, color: CHOCO });
    page.drawLine({ start: { x: M, y: top(y + 9) }, end: { x: W - M, y: top(y + 9) }, thickness: 0.5, color: PINK_SOFT });
    y += 24;
  }

  // Total
  y += 8;
  page.drawText("TOTAL", { x: colPrice - 20, y: top(y), size: 12, font: bold, color: CHOCO });
  const total = money(r.total);
  page.drawText(total, { x: colSub - bold.widthOfTextAtSize(total, 16), y: top(y), size: 16, font: bold, color: PINK });
  y += 30;

  // Estado
  const st = STATUS_LABEL[r.status];
  const stW = bold.widthOfTextAtSize(st.text, 10) + 24;
  page.drawRectangle({ x: M, y: top(y + 8), width: stW, height: 24, borderColor: st.color, borderWidth: 1.5, color: rgb(1, 1, 1) });
  page.drawText(st.text, { x: M + 12, y: top(y), size: 10, font: bold, color: st.color });
  page.drawText("Medio de pago: Yape", { x: M + stW + 14, y: top(y), size: 10, font, color: GRAY });
  y += 36;

  if (noteLines.length) {
    page.drawText("NOTAS", { x: M, y: top(y), size: 8, font: bold, color: PINK });
    y += 13;
    for (const l of noteLines) {
      page.drawText(l, { x: M, y: top(y), size: 9, font, color: GRAY });
      y += 12;
    }
    y += 8;
  }

  // Datos de pago y contacto
  page.drawRectangle({ x: M, y: top(y + 52), width: W - M * 2, height: 60, color: rgb(0.98, 0.95, 1), borderColor: rgb(0.45, 0.13, 0.52), borderWidth: 1 });
  page.drawText("Yape", { x: M + 12, y: top(y + 14), size: 11, font: bold, color: rgb(0.45, 0.13, 0.52) });
  page.drawText(`${clean(shop.yapeNumber)}  ·  ${fit(shop.yapeName, font, 10, 200)}`, { x: M + 12, y: top(y + 29), size: 10, font, color: CHOCO });
  page.drawText(`WhatsApp: +${clean(shop.whatsapp)}  ·  ${fit(shop.address, font, 9, 150)}`, { x: M + 12, y: top(y + 43), size: 9, font, color: GRAY });

  // Pie
  const thanks = "Gracias por tu compra!";
  page.drawText(thanks, { x: (W - bold.widthOfTextAtSize(thanks, 14)) / 2, y: 52, size: 14, font: bold, color: PINK });
  const tag = "Mas que postres, son momentos";
  page.drawText(tag, { x: (W - font.widthOfTextAtSize(tag, 9)) / 2, y: 36, size: 9, font, color: GRAY });
  CANDY.forEach((c, i) => page.drawCircle({ x: W / 2 - 62 + i * 25, y: 16, size: 5, color: c }));

  return pdf.save();
}
