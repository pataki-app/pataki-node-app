import { ProductDoc } from '../models/product.model';

export interface ICart {
  items: IProduct[];
  count: number;
  total: number;
}

export interface IProduct {
  product: ProductDoc | any;
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
    // Find product in items
    const index = this.items.findIndex(
      (item) => item?.product?._id === product?.product?.id
    );
    // clone new items
    const newitems = [...this.items];
    // if dont exist produxct add to items array
    if (index === -1) {
      newitems.push(product);
    } else {
      newitems[index].count++;
      newitems[index].total = newitems[index].count * product.total;
    }
    this.items = newitems;
    this.count = this.items.reduce(
      (unit, item) => (unit += item?.count ?? 0),
      0
    );
    this.total = this.items.reduce(
      (total, item) => (total += item?.total ?? 0),
      0
    );
  }

  remove(product: IProduct): void {
    const index = this.items.findIndex(
      (item) => item?.product?._id === product?.product?.id
    );
    let _cantidad = this.items[index]?.count;
    const newitems = [...this.items];
    if (_cantidad && _cantidad > 1) {
      _cantidad = this.items[index].count - 1;
      newitems[index].count = _cantidad;
      newitems[index].total = product.total * _cantidad;
    } else {
      delete newitems[index];
    }
    this.items = newitems;
    if (newitems.length > 0) {
      this.count = this.items.reduce(
        (unit, item) => (unit += item?.count ?? 0),
        0
      );
      this.total = this.items.reduce(
        (total, item) => (total += item?.total ?? 0),
        0
      );
    } else {
      this.count = 0;
      this.total = 0;
    }
  }
}

export default Cart;
