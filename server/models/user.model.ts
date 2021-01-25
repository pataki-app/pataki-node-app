import * as mongoose from 'mongoose';
import { RoleUser } from './user.type';
import { ModelType } from './model.type';

export interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  role: string;
  cart: string[];
}

const Schema = mongoose.Schema;

const userModel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: RoleUser.user,
    },
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: ModelType.product,
          },
          count: {
            type: Number,
            required: true,
          },
          total: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserDoc>(ModelType.user, userModel);

userModel.static('build', (attrs: UserDoc) => {
  return new User(attrs);
});

export default User;
