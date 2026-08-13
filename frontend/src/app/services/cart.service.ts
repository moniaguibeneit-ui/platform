import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, AddToCartRequest } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  private CART_STORAGE_KEY = 'perfume_market_cart';

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        this.cartSubject.next(cart);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        localStorage.removeItem(this.CART_STORAGE_KEY);
      }
    }
  }

  private saveCart(cart: Cart): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  getCart(): Cart | null {
    return this.cartSubject.value;
  }

  getCartCount(): number {
    return this.cartSubject.value?.totalItems || 0;
  }

  getCartTotal(): number {
    return this.cartSubject.value?.totalAmount || 0;
  }

  addToCart(request: AddToCartRequest): Cart {
    let cart = this.cartSubject.value;

    // If cart exists but for different tenant, clear it
    if (cart && cart.tenantId !== request.tenantId) {
      cart = null;
    }

    // Create new cart if doesn't exist
    if (!cart) {
      cart = {
        tenantId: request.tenantId,
        tenantName: '', // Will be filled when loading tenant info
        items: [],
        totalAmount: 0,
        totalItems: 0
      };
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === request.productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + request.quantity;
      
      // Check stock
      if (request.stockQuantity && newQuantity > request.stockQuantity) {
        throw new Error(`Only ${request.stockQuantity} items available in stock`);
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].lineTotal = newQuantity * request.unitPrice;
    } else {
      // Add new item
      // Check stock
      if (request.stockQuantity && request.quantity > request.stockQuantity) {
        throw new Error(`Only ${request.stockQuantity} items available in stock`);
      }

      const newItem: CartItem = {
        productId: request.productId,
        productName: request.productName,
        productImage: request.productImage,
        brand: request.brand,
        quantity: request.quantity,
        unitPrice: request.unitPrice,
        lineTotal: request.quantity * request.unitPrice,
        inStock: request.inStock,
        stockQuantity: request.stockQuantity
      };

      cart.items.push(newItem);
    }

    // Recalculate totals
    this.recalculateCartTotals(cart);
    this.saveCart(cart);

    return cart;
  }

  updateItemQuantity(productId: string, quantity: number): Cart {
    const cart = this.cartSubject.value;
    if (!cart) throw new Error('Cart is empty');

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex < 0) throw new Error('Item not found in cart');

    const item = cart.items[itemIndex];

    // Check stock
    if (item.stockQuantity && quantity > item.stockQuantity) {
      throw new Error(`Only ${item.stockQuantity} items available in stock`);
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].lineTotal = quantity * item.unitPrice;
    }

    // Recalculate totals
    this.recalculateCartTotals(cart);

    if (cart.items.length === 0) {
      this.clearCart();
      return this.getCart()!;
    }

    this.saveCart(cart);
    return cart;
  }

  removeItem(productId: string): Cart {
    const cart = this.cartSubject.value;
    if (!cart) throw new Error('Cart is empty');

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex < 0) throw new Error('Item not found in cart');

    cart.items.splice(itemIndex, 1);

    // Recalculate totals
    this.recalculateCartTotals(cart);

    if (cart.items.length === 0) {
      this.clearCart();
      return this.getCart()!;
    }

    this.saveCart(cart);
    return cart;
  }

  clearCart(): void {
    localStorage.removeItem(this.CART_STORAGE_KEY);
    this.cartSubject.next(null);
  }

  setTenantInfo(tenantId: string, tenantName: string, tenantLogo?: string): void {
    let cart = this.cartSubject.value;
    
    if (!cart) {
      cart = {
        tenantId,
        tenantName,
        tenantLogo,
        items: [],
        totalAmount: 0,
        totalItems: 0
      };
    } else {
      cart.tenantId = tenantId;
      cart.tenantName = tenantName;
      cart.tenantLogo = tenantLogo;
    }

    this.saveCart(cart);
  }

  private recalculateCartTotals(cart: Cart): void {
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.lineTotal, 0);
  }

  isCartForTenant(tenantId: string): boolean {
    const cart = this.cartSubject.value;
    return cart ? cart.tenantId === tenantId : true;
  }
}
