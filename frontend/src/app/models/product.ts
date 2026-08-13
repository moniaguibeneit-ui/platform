export interface Product {
  id?: string;
  name: string;
  brand?: string;
  description?: string;
  price: number;
  category?: string;
  categoryId?: string;
  volume?: string;
  fragranceNotes?: string;
  inStock: boolean;
  stockQuantity?: number;
  imageUrl?: string;
  images?: string[];
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}
