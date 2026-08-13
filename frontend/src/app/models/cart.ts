export interface CartItem {
  productId: string;
  productName: string;
  productImage?: string;
  brand?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  inStock: boolean;
  stockQuantity?: number;
}

export interface Cart {
  tenantId: string;
  tenantName: string;
  tenantLogo?: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface AddToCartRequest {
  tenantId: string;
  productId: string;
  productName: string;
  productImage?: string;
  brand?: string;
  unitPrice: number;
  quantity: number;
  inStock: boolean;
  stockQuantity?: number;
}
