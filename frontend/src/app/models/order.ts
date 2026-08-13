export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id?: string;
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id?: string;
  orderNumber?: string;
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  items: OrderItem[];
  tenantId?: string;
  paymentMethod: 'CASH_ON_DELIVERY';
  createdAt?: string;
  updatedAt?: string;
  confirmedAt?: string;
  preparingAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderRequest {
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  notes?: string;
  items: { productId: string; productName: string; quantity: number; unitPrice: number }[];
  paymentMethod?: 'CASH_ON_DELIVERY';
}
