import QRCode from "qrcode";

// Si el admin subió su QR real de Yape se usa ese; si no, se genera uno con el número.
export async function yapeQr(number: string, uploaded: string) {
  if (uploaded) return uploaded;
  return QRCode.toDataURL(number, { margin: 1, width: 400, color: { dark: "#742284", light: "#ffffff" } });
}
