import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from './shared/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly cart = inject(CartService);
  readonly title = 'Pizza Paradise';
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  openCart(): void {
    this.menuOpen = false;
    this.cart.openDrawer();
  }

  decrementItem(id: string, quantity: number): void {
    this.cart.updateQuantity(id, quantity - 1);
  }

  incrementItem(id: string, quantity: number): void {
    this.cart.updateQuantity(id, quantity + 1);
  }

  trackById(_index: number, item: { id: string }): string {
    return item.id;
  }
}
