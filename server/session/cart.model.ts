import { ProductDoc } from '../models/product.model';

export interface ICart {
  items: IProduct[];
  count: number;
  total: number;
}

export interface IProduct {
  product: ProductDoc;
  count: number;
  total: number;
}

class Cart {
  public items: IProduct[] = [];
  public count = 0;
  public total = 0;
  constructor(cart: ICart) {
    this.items = cart.items || [];
    this.count = cart.count || 0;
    this.total = cart.total || 0;
  }

  addProduct(product: IProduct): void {
    const index = this.items.findIndex(
      (item) => item.product.id === product.product.id
    );
    const newitems = [...this.items];
    if (index === -1) {
      newitems.push(product);
    } else {
      newitems[index].count++;
      newitems[index].total = newitems[index].count * product.total;
    }
    this.items = newitems;
    this.count = this.items.reduce((unit, item) => (unit += item.count), 0);
    this.total = this.items.reduce((total, item) => (total += item.total), 0);
  }
}

export default Cart;
