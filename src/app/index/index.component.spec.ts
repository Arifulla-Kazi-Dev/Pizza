import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { IndexComponent } from './index.component';
import { CartService } from '../shared/cart.service';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    TestBed.inject(CartService).clear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a menu pizza to the shared basket and opens it', () => {
    const cart = TestBed.inject(CartService);

    component.addPizza(component.pizzas[0]);

    expect(cart.items()[0].name).toBe('Classic Margherita');
    expect(cart.subtotal()).toBe(299);
    expect(cart.drawerOpen()).toBeTrue();
  });
});
