import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // private apiUrl = 'api/products'; // for real backend

private products: Product[] = [
  {
    id: 1,
    name: 'Chanel No. 5',
    brand: 'Chanel',
    description: 'Iconic floral aldehyde fragrance',
    price: 120,
    category: 'Perfume',
    volume: '100ml',
    fragranceNotes: 'Aldehyde, Jasmine, Rose',
    inStock: true,
    imageUrl: 'assets/images/chanel5.jpg'
  },
  {
    id: 2,
    name: 'Dior Sauvage',
    brand: 'Dior',
    description: 'Fresh, spicy, and woody',
    price: 95,
    category: 'Perfume',
    volume: '60ml',
    fragranceNotes: 'Bergamot, Pepper, Ambroxan',
    inStock: false,
    imageUrl: 'assets/images/dior-sauvage.jpg'
  },
  {
    id: 3,
    name: 'YSL Black Opium',
    brand: 'Yves Saint Laurent',
    description: 'Addictive, intense, and sensual',
    price: 110,
    category: 'Perfume',
    volume: '50ml',
    fragranceNotes: 'Coffee, Vanilla, White Flowers',
    inStock: true,
    imageUrl: 'assets/images/black-opium.jpg'
  }
];

  constructor(private http: HttpClient) {}

  // GET all products
  getProducts(): Observable<Product[]> {
    // return this.http.get<Product[]>(this.apiUrl);
    return of([...this.products]);
  }

  // GET a single product by id
  getProduct(id: number): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    return of({ ...product } as Product);
  }

  // POST new product
  addProduct(product: Product): Observable<Product> {
    const newId = this.products.length + 1;
    const newProduct = { ...product, id: newId };
    this.products.push(newProduct);
    return of(newProduct);
  }

  // PUT update product
  updateProduct(product: Product): Observable<Product> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = { ...product };
    }
    return of(product);
  }

  // DELETE product
  deleteProduct(id: number): Observable<void> {
    this.products = this.products.filter(p => p.id !== id);
    return of();
  }
}