import { Schema, model, Document } from 'mongoose';
import { ModelType } from './model.type';
import { UserDoc } from './user.model';
import { ProductDoc } from './product.model';
import { IProduct } from '../session/cart.model';

export interface OrderDoc extends Document {
  user: {
    name: string;
    email: string;
    userId: UserDoc;
  };
  products: IProduct[];
  total: number;
  order_date: Date;
  createOrder(docUser: UserDoc): Promise<Document<OrderDoc>>;
}

const orderModel: Schema<OrderDoc> = new Schema(
  {
    user: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: ModelType.user,
      },
    },
    products: [
      {
        product: {
          type: Object,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    order_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

orderModel.methods.createOrder = async function (
  docUser: UserDoc
): Promise<Document<OrderDoc>> {
  const docUserPopulate = await docUser
    .populate('cart.items.product')
    .execPopulate();

  let total = 0;

  const products = docUserPopulate.cart.items.map((itemproduct) => {
    total += itemproduct.count * itemproduct.product.value;
    itemproduct.product.stock -= itemproduct.count;
    itemproduct.product.sold += itemproduct.count;
    itemproduct.product.save();
    const objectClone: ProductDoc = { ...itemproduct.product.toObject() };

    objectClone.stock = undefined;
    objectClone.sold = undefined;
    objectClone.image = undefined;
    objectClone.evaluation = { items: null, point: 0 };

    const productReturn: IProduct = {
      product: objectClone,
      count: itemproduct.count,
    };
    return productReturn;
  });

  this.products = products;
  this.total = total;
  return this.save();
};

const Order = model<OrderDoc>(ModelType.order, orderModel);

orderModel.static('build', (attrs: OrderDoc) => {
  return new Order(attrs);
});

export default Order;
