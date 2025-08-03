export interface InvoiceItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  totalAmount: number;
  paymentMethod: string;
  soldBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceApiResponse {
  success: boolean;
  data: Invoice;
}

export interface InvoicesApiResponse {
  success: boolean;
  data: Invoice[];
} 