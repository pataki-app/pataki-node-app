import { Schema, model, Document } from 'mongoose';
import { ModelType } from './model.type';
import { ProductDoc } from './product.model';
import { UserDoc } from './user.model';

export interface EvaluationDoc extends Document {
  product: ProductDoc;
  user: UserDoc;
  point: number;
  comment: string;
  createEvaluation(docProduct: ProductDoc): Promise<Document<any>>;
}

const evaluationModel: Schema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: ModelType.product,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: ModelType.user,
      required: true,
    },
    point: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

evaluationModel.methods.createEvaluation = async function (
  docProduct: ProductDoc
): Promise<Document<any>> {
  const docProductPopulate = await docProduct
    .populate('evaluation.items')
    .execPopulate();

  const oldProducts = docProductPopulate.evaluation?.items
    ? [...docProductPopulate.evaluation.items]
    : [];

  oldProducts.push({
    evaluationId: this.id,
  });

  const products = await Evaluation.find({
    product: docProduct,
  }).exec();

  let productPoints = 0;

  products.map((product: any) => {
    productPoints = product.point + productPoints;
  });

  const value = this.get('point');
  const productSum = productPoints + value;
  const productCount = products.length + 1;

  const percentProduct =
    products.length > 0 ? productSum / productCount : value;

  docProductPopulate.evaluation.items = oldProducts;
  docProductPopulate.evaluation.point = Math.round(percentProduct);
  await docProductPopulate.save();

  return this.save();
};

const Evaluation = model<EvaluationDoc>(ModelType.evaluation, evaluationModel);

evaluationModel.static('build', (attrs: EvaluationDoc) => {
  return new Evaluation(attrs);
});

export default Evaluation;
