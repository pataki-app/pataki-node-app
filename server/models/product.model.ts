import * as mongoose from 'mongoose';
import { ModelType } from './model.type';
import CategoryModel from './category.model';
import { EvaluationDoc } from './evaluation.model';

export interface ProductDoc extends mongoose.Document {
  name: string;
  description: string;
  value: number;
  stock: number;
  sold: number;
  available: boolean;
  image?: {
    data: Buffer;
    contentType: string;
  };
  category: string;
  evaluation: {
    items: any;
    point: number;
  };
}

const Schema = mongoose.Schema;

const productModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    valueDiscount: {
      type: Number,
    },
    stock: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    category: {
      type: String,
      required: true,
    },
    discount: {
      type: Boolean,
    },
    evaluation: {
      items: [
        {
          evaluationId: {
            type: Schema.Types.ObjectId,
            ref: ModelType.evaluation,
          },
        },
      ],
      point: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<ProductDoc>(ModelType.product, productModel);

productModel.static('build', (attrs: ProductDoc) => {
  return new Product(attrs);
});

export default Product;
