export type ReceiptItem = { id: number; name: string; price: number; qty: number };

export type ReceiptStatus = "pendiente" | "pagado" | "entregado" | "cancelado";

export type Receipt = {
  id: number;
  code: string;
  customer: string;
  phone: string;
  notes: string;
  items: ReceiptItem[];
  total: number;
  status: ReceiptStatus;
  createdAt: string;
  dateLabel: string;
  token: string;
};

export type ShopInfo = {
  name: string;
  address: string;
  whatsapp: string;
  yapeNumber: string;
  yapeName: string;
};
