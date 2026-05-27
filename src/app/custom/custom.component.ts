import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartService } from '../shared/cart.service';

interface PizzaOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface PizzaSize extends PizzaOption {
  diameter: string;
  slices: number;
}

type ToppingCategory = 'all' | 'garden' | 'protein' | 'finish';

interface Topping extends PizzaOption {
  category: Exclude<ToppingCategory, 'all'>;
}

interface CategoryFilter {
  id: ToppingCategory;
  label: string;
}

@Component({
  selector: 'app-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomComponent {
  private readonly cart = inject(CartService);

  readonly sizes: PizzaSize[] = [
    { id: 'solo', name: 'Solo', diameter: '8 in', slices: 4, description: 'Perfect for one', price: 249 },
    { id: 'classic', name: 'Classic', diameter: '12 in', slices: 6, description: 'Our most loved', price: 399 },
    { id: 'feast', name: 'Feast', diameter: '16 in', slices: 8, description: 'Made for sharing', price: 599 }
  ];

  readonly crusts: PizzaOption[] = [
    { id: 'artisan', name: 'Artisan hand-tossed', description: 'Soft center, crisp edge', price: 0 },
    { id: 'thin', name: 'Fire-crisp thin', description: 'Light and crackly', price: 49 },
    { id: 'stuffed', name: 'Stuffed cheese rim', description: 'Mozzarella-filled crust', price: 99 }
  ];

  readonly sauces: PizzaOption[] = [
    { id: 'pomodoro', name: 'Roasted tomato', description: 'Sweet basil finish', price: 0 },
    { id: 'garlic', name: 'White garlic', description: 'Creamy and mellow', price: 39 },
    { id: 'smoky', name: 'Smoky BBQ', description: 'Tangy slow-cooked glaze', price: 49 }
  ];

  readonly cheeses: PizzaOption[] = [
    { id: 'mozzarella', name: 'Fresh mozzarella', description: 'Classic stretch', price: 0 },
    { id: 'triple', name: 'Triple cheese', description: 'Mozzarella, cheddar, parmesan', price: 89 },
    { id: 'plant', name: 'Plant-based melt', description: 'Dairy-free and creamy', price: 79 }
  ];

  readonly toppingCategories: CategoryFilter[] = [
    { id: 'all', label: 'All' },
    { id: 'garden', label: 'Garden' },
    { id: 'protein', label: 'Protein' },
    { id: 'finish', label: 'Finishes' }
  ];

  readonly toppings: Topping[] = [
    { id: 'pepperoni', name: 'Cup pepperoni', description: 'Crispy edges', price: 79, category: 'protein' },
    { id: 'mushroom', name: 'Roasted mushroom', description: 'Earthy and tender', price: 59, category: 'garden' },
    { id: 'pepper', name: 'Sweet peppers', description: 'Colorful crunch', price: 49, category: 'garden' },
    { id: 'olive', name: 'Black olives', description: 'Briny slices', price: 49, category: 'garden' },
    { id: 'chicken', name: 'Grilled chicken', description: 'Flame-kissed', price: 99, category: 'protein' },
    { id: 'onion', name: 'Red onion', description: 'Thinly shaved', price: 39, category: 'garden' },
    { id: 'basil', name: 'Fresh basil', description: 'After-bake finish', price: 39, category: 'finish' },
    { id: 'honey', name: 'Hot honey', description: 'Sweet heat drizzle', price: 59, category: 'finish' }
  ];

  readonly toppingPieces = [1, 2, 3, 4, 5];
  readonly freeDeliveryThreshold = 999;
  readonly regularDeliveryFee = 49;

  selectedSizeId = 'classic';
  selectedCrustId = 'artisan';
  selectedSauceId = 'pomodoro';
  selectedCheeseId = 'mozzarella';
  selectedToppingIds = new Set<string>(['basil']);
  activeCategory: ToppingCategory = 'all';
  quantity = 1;
  orderPlaced = false;
  announcement = 'Your pizza is ready to customize.';

  get selectedSize(): PizzaSize {
    return this.sizes.find(size => size.id === this.selectedSizeId) ?? this.sizes[1];
  }

  get selectedCrust(): PizzaOption {
    return this.crusts.find(crust => crust.id === this.selectedCrustId) ?? this.crusts[0];
  }

  get selectedSauce(): PizzaOption {
    return this.sauces.find(sauce => sauce.id === this.selectedSauceId) ?? this.sauces[0];
  }

  get selectedCheese(): PizzaOption {
    return this.cheeses.find(cheese => cheese.id === this.selectedCheeseId) ?? this.cheeses[0];
  }

  get filteredToppings(): Topping[] {
    if (this.activeCategory === 'all') {
      return this.toppings;
    }

    return this.toppings.filter(topping => topping.category === this.activeCategory);
  }

  get selectedToppings(): Topping[] {
    return this.toppings.filter(topping => this.selectedToppingIds.has(topping.id));
  }

  get toppingsTotal(): number {
    return this.selectedToppings.reduce((total, topping) => total + topping.price, 0);
  }

  get unitPrice(): number {
    return this.selectedSize.price
      + this.selectedCrust.price
      + this.selectedSauce.price
      + this.selectedCheese.price
      + this.toppingsTotal;
  }

  get subtotal(): number {
    return this.unitPrice * this.quantity;
  }

  get deliveryFee(): number {
    return this.subtotal >= this.freeDeliveryThreshold ? 0 : this.regularDeliveryFee;
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  get amountUntilFreeDelivery(): number {
    return Math.max(this.freeDeliveryThreshold - this.subtotal, 0);
  }

  get previewDescription(): string {
    const toppingText = this.selectedToppings.length
      ? this.selectedToppings.map(topping => topping.name).join(', ')
      : 'no extra toppings';
    return `${this.selectedSize.name} ${this.selectedCrust.name} pizza with ${this.selectedSauce.name}, ${this.selectedCheese.name}, and ${toppingText}.`;
  }

  selectSize(id: string): void {
    this.selectedSizeId = id;
    this.markOrderChanged();
  }

  selectCrust(id: string): void {
    this.selectedCrustId = id;
    this.markOrderChanged();
  }

  selectSauce(id: string): void {
    this.selectedSauceId = id;
    this.markOrderChanged();
  }

  selectCheese(id: string): void {
    this.selectedCheeseId = id;
    this.markOrderChanged();
  }

  filterToppings(category: ToppingCategory): void {
    this.activeCategory = category;
  }

  setTopping(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const updatedToppings = new Set(this.selectedToppingIds);

    if (checked) {
      updatedToppings.add(id);
    } else {
      updatedToppings.delete(id);
    }

    this.selectedToppingIds = updatedToppings;
    this.markOrderChanged();
  }

  isToppingSelected(id: string): boolean {
    return this.selectedToppingIds.has(id);
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity -= 1;
      this.markOrderChanged();
    }
  }

  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity += 1;
      this.markOrderChanged();
    }
  }

  resetPizza(): void {
    this.selectedSizeId = 'classic';
    this.selectedCrustId = 'artisan';
    this.selectedSauceId = 'pomodoro';
    this.selectedCheeseId = 'mozzarella';
    this.selectedToppingIds = new Set<string>(['basil']);
    this.activeCategory = 'all';
    this.quantity = 1;
    this.orderPlaced = false;
    this.announcement = 'Your builder has been reset to the house favorite.';
  }

  addToOrder(event: Event): void {
    event.preventDefault();
    const toppingIds = [...this.selectedToppingIds].sort().join('-') || 'plain';
    this.cart.addItem({
      id: `custom-${this.selectedSizeId}-${this.selectedCrustId}-${this.selectedSauceId}-${this.selectedCheeseId}-${toppingIds}`,
      kind: 'custom',
      name: `${this.selectedSize.name} Custom Pizza`,
      description: `${this.selectedCrust.name}, ${this.selectedToppings.length} topping${this.selectedToppings.length === 1 ? '' : 's'}`,
      unitPrice: this.unitPrice,
      quantity: this.quantity
    });
    this.orderPlaced = true;
    this.announcement = `${this.quantity} custom pizza${this.quantity === 1 ? '' : 's'} added to your basket.`;
    this.cart.openDrawer();
  }

  trackById(_index: number, option: { id: string }): string {
    return option.id;
  }

  trackByValue(_index: number, value: number): number {
    return value;
  }

  private markOrderChanged(): void {
    this.orderPlaced = false;
    this.announcement = 'Order updated. Your price summary has been refreshed.';
  }
}
