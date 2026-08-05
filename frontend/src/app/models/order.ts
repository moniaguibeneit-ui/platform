export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

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
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  items: OrderItem[];
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderRequest {
  userId?: string;
  notes?: string;
  items: { productId: string; productName: string; quantity: number; unitPrice: number }[];
}
