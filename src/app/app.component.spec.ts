import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { CartService } from './shared/cart.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    TestBed.inject(CartService).clear();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the restaurant title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Pizza Paradise');
  });

  it('should render the restaurant brand', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain('Pizza Paradise');
  });

  it('opens the mobile navigation and renders basket items', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const cart = TestBed.inject(CartService);

    app.toggleMenu();
    cart.addItem({
      id: 'menu-margherita',
      kind: 'menu',
      name: 'Classic Margherita',
      description: 'Regular',
      unitPrice: 299,
      quantity: 1
    });
    app.openCart();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(cart.itemCount()).toBe(1);
    expect(compiled.querySelector('.cart-line')?.textContent).toContain('Classic Margherita');
  });
});
