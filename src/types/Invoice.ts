export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export type Invoice = {
  id: number;
  organizationId: string;
  clientId: number;
  projectId: number | null;
  invoiceNumber: string;
  status: InvoiceStatus;
  dueDate: Date;
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  notes: string | null;
  stripePaymentIntentId: string | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type InvoiceItem = {
  id: number;
  invoiceId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};
