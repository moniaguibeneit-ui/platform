export interface Product {
  id?: string;
  name: string;
  brand?: string;
  description?: string;
  price: number;
  category?: string;
  volume?: string;
  fragranceNotes?: string;
  inStock: boolean;
  imageUrl?: string;
  images?: string[];
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}
