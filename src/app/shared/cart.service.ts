import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export interface CartItem {
  id: string;
  kind: 'menu' | 'custom';
  name: string;
  description: string;
  unitPrice: number;
  quantity: number;
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'pizza-paradise-basket';
  private readonly cartItems = signal<CartItem[]>(this.restoreItems());

  readonly items = this.cartItems.asReadonly();
  readonly drawerOpen = signal(false);
  readonly orderConfirmed = signal(false);
  readonly itemCount = computed(() => this.cartItems().reduce((count, item) => count + item.quantity, 0));
  readonly subtotal = computed(() => this.cartItems().reduce((total, item) => total + item.unitPrice * item.quantity, 0));
  readonly deliveryFee = computed(() => {
    if (!this.cartItems().length || this.subtotal() >= 999) {
      return 0;
    }

    return 49;
  });
  readonly total = computed(() => this.subtotal() + this.deliveryFee());

  addItem(item: CartItem): void {
    this.orderConfirmed.set(false);
    const existing = this.cartItems().find(entry => entry.id === item.id);

    if (existing) {
      this.commit(this.cartItems().map(entry => entry.id === item.id
        ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, 10) }
        : entry));
      return;
    }

    this.commit([...this.cartItems(), item]);
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(id);
      return;
    }

    this.orderConfirmed.set(false);
    this.commit(this.cartItems().map(item => item.id === id
      ? { ...item, quantity: Math.min(quantity, 10) }
      : item));
  }

  removeItem(id: string): void {
    this.orderConfirmed.set(false);
    this.commit(this.cartItems().filter(item => item.id !== id));
  }

  clear(): void {
    this.orderConfirmed.set(false);
    this.commit([]);
  }

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  confirmOrder(): void {
    if (this.cartItems().length) {
      this.orderConfirmed.set(true);
    }
  }

  private commit(items: CartItem[]): void {
    this.cartItems.set(items);

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
      } catch {
        // The in-memory basket still functions when browser storage is unavailable.
      }
    }
  }

  private restoreItems(): CartItem[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    try {
      const storedItems: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      return Array.isArray(storedItems)
        ? storedItems.filter((item): item is CartItem => this.isValidItem(item))
        : [];
    } catch {
      return [];
    }
  }

  private isValidItem(item: unknown): item is CartItem {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const entry = item as Partial<CartItem>;
    return typeof entry.id === 'string'
      && (entry.kind === 'menu' || entry.kind === 'custom')
      && typeof entry.name === 'string'
      && typeof entry.description === 'string'
      && typeof entry.unitPrice === 'number'
      && Number.isFinite(entry.unitPrice)
      && entry.unitPrice >= 0
      && typeof entry.quantity === 'number'
      && Number.isInteger(entry.quantity)
      && entry.quantity > 0
      && entry.quantity <= 10;
  }
}
