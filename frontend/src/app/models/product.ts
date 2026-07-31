export interface Product {
  id?: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;       // e.g., 'Perfume'
  volume: string;         // e.g., '50ml', '100ml'
  fragranceNotes: string; // e.g., 'Floral, Woody, Citrus'
  inStock: boolean;
  imageUrl?: string;      // base64 or URL
  createdAt?: Date;
}