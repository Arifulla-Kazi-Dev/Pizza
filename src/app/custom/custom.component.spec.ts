import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomComponent } from './custom.component';
import { CartService } from '../shared/cart.service';

describe('CustomComponent', () => {
  let component: CustomComponent;
  let fixture: ComponentFixture<CustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomComponent);
    component = fixture.componentInstance;
    TestBed.inject(CartService).clear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calculates a live total and unlocks free delivery for larger orders', () => {
    component.selectSize('feast');
    component.selectCrust('stuffed');
    component.selectCheese('triple');
    component.selectedToppingIds = new Set(['pepperoni', 'basil']);
    component.increaseQuantity();

    expect(component.subtotal).toBe(1810);
    expect(component.deliveryFee).toBe(0);
    expect(component.total).toBe(1810);
  });

  it('resets the pizza to the house favorite', () => {
    component.selectSize('solo');
    component.selectedToppingIds = new Set(['chicken']);
    component.increaseQuantity();

    component.resetPizza();

    expect(component.selectedSizeId).toBe('classic');
    expect(component.isToppingSelected('basil')).toBeTrue();
    expect(component.quantity).toBe(1);
  });

  it('adds a configured pizza to the persistent basket', () => {
    const cart = TestBed.inject(CartService);

    component.addToOrder(new Event('submit'));

    expect(cart.items()[0].kind).toBe('custom');
    expect(cart.items()[0].unitPrice).toBe(component.unitPrice);
    expect(cart.drawerOpen()).toBeTrue();
  });
});
