import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../shared/cart.service';

type MenuFilter = 'all' | 'veg' | 'non-veg';

interface MenuPizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: Exclude<MenuFilter, 'all'>;
  badge?: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent {
  private readonly cart = inject(CartService);

  readonly filters: { id: MenuFilter; label: string }[] = [
    { id: 'all', label: 'All pizzas' },
    { id: 'veg', label: 'Vegetarian' },
    { id: 'non-veg', label: 'Chicken & meat' }
  ];

  readonly pizzas: MenuPizza[] = [
    {
      id: 'margherita',
      name: 'Classic Margherita',
      description: 'San Marzano tomato, mozzarella, basil and olive oil.',
      price: 299,
      image: 'assets/images/MargheritaPizza.jpg',
      type: 'veg',
      badge: 'Classic'
    },
    {
      id: 'farmhouse',
      name: 'Loaded Farmhouse',
      description: 'Onion, capsicum, mushroom, sweet corn and mozzarella.',
      price: 449,
      image: 'assets/images/FarmhousePizza.jpg',
      type: 'veg',
      badge: 'Popular'
    },
    {
      id: 'veggie',
      name: 'Garden Veggie',
      description: 'Roasted peppers, olives, tomatoes and herbed cheese.',
      price: 399,
      image: 'assets/images/VeggiePizza.jpg',
      type: 'veg'
    },
    {
      id: 'pepperoni',
      name: 'Pepperoni Blaze',
      description: 'Crisp pepperoni cups, mozzarella and chilli flakes.',
      price: 499,
      image: 'assets/images/PepperoniPizza.jpg',
      type: 'non-veg',
      badge: 'Bestseller'
    },
    {
      id: 'bbq-chicken',
      name: 'BBQ Chicken',
      description: 'Grilled chicken, smoky BBQ glaze, onion and cheese.',
      price: 549,
      image: 'assets/images/BBQChickenPizza.jpg',
      type: 'non-veg'
    },
    {
      id: 'meat-lovers',
      name: 'Meat Lovers Feast',
      description: 'Chicken sausage, pepperoni and extra mozzarella.',
      price: 599,
      image: 'assets/images/MeatLoversPizza.jpg',
      type: 'non-veg'
    }
  ];

  searchTerm = '';
  activeFilter: MenuFilter = 'all';
  announcement = '';

  get filteredPizzas(): MenuPizza[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.pizzas.filter(pizza => {
      const matchesFilter = this.activeFilter === 'all' || pizza.type === this.activeFilter;
      const matchesSearch = !query
        || pizza.name.toLowerCase().includes(query)
        || pizza.description.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }

  search(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  filterBy(filter: MenuFilter): void {
    this.activeFilter = filter;
  }

  addPizza(pizza: MenuPizza): void {
    this.cart.addItem({
      id: `menu-${pizza.id}`,
      kind: 'menu',
      name: pizza.name,
      description: 'Regular / Hand-tossed',
      unitPrice: pizza.price,
      quantity: 1,
      image: pizza.image
    });
    this.announcement = `${pizza.name} added to your basket.`;
    this.cart.openDrawer();
  }

  trackById(_index: number, value: { id: string }): string {
    return value.id;
  }
}
