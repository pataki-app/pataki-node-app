import { Schema, model, Document, CallbackError } from 'mongoose';
import { ModelType } from './model.type';
import { UserDoc } from './user.model';
import ProductModel, { ProductDoc } from './product.model';
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
    .populate('cart.items.productId')
    .execPopulate();

  let total = 0;
  const products: IProduct[] = [];
  docUserPopulate.cart.items.map((itemproduct) => {
    ProductModel.findById(itemproduct._id).exec(
      (error: CallbackError, item: ProductDoc) => {
        if (item) {
          total += itemproduct.count * item.value;
          console.log(total);
          itemproduct.product.stock -= itemproduct.count;
          itemproduct.product.sold += itemproduct.count;
          itemproduct.product.save();
          const objectClone: ProductDoc = { ...itemproduct.product.toObject() };

          objectClone.stock = undefined;
          objectClone.sold = undefined;
          objectClone.image = undefined;
          const productReturn: IProduct = {
            product: objectClone,
            count: itemproduct.count,
          };
          products.push(productReturn);
        }
      }
    );
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
