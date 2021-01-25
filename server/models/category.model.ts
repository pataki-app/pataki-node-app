import * as mongoose from 'mongoose';
import { ModelType } from './model.type';

export interface CategoryDoc extends mongoose.Document {
  name: string;
}

const Schema = mongoose.Schema;

const categoryModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<CategoryDoc>(ModelType.category, categoryModel);

categoryModel.static('build', (attrs: CategoryDoc) => {
  return new Category(attrs);
});

export default Category;
