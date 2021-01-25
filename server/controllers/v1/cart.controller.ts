import { Request, Response, NextFunction } from 'express';
import * as httpStatus from 'http-status';
import ProductModel, { ProductDoc } from '../../models/product.model';
import { ErrorProduct } from '../../models/product.type';
import Cart, { IProduct, ICart } from '../../session/cart.model';
import { ResponseApi } from '../../models/model.type';

interface ProductRequest extends Request {
  docProduct: ProductDoc;
  session: any;
}

const cartList = async (cart: Cart) => {
  const ids = cart.items.map((item) => item?.product?._id);
  const docProduct = await ProductModel.find({ _id: { $in: ids } })
    .select('-sold -available -createdAt -updatedAt -__v -image')
    .lean()
    .exec();
  const _cart: ICart = { ...cart, items: docProduct };
  return _cart;
};

export const addProductSession = async (
  req: ProductRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.docProduct) {
      const response: ResponseApi = {
        isOk: false,
        data: null,
        message: ErrorProduct.NotFoundProduct,
        statusCode: httpStatus.OK,
      };
      res.status(httpStatus.OK).json(response);
    }
    const cart = new Cart(req.session?.cart ? req.session.cart : []);
    const objProduct: IProduct = {
      product: req.docProduct,
      count: 1,
      total: req.docProduct?.value,
    };
    cart.addProduct(objProduct);
    req.session.cart = cart;
    const cartAllList = await cartList(cart);
    const response: ResponseApi = {
      isOk: true,
      data: cartAllList,
      statusCode: httpStatus.OK,
    };
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const cartListSession = async (
  req: ProductRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = new Cart(req.session.cart ? req.session.cart : []);
    const cartListProducts = await cartList(cart);
    const response: ResponseApi = {
      isOk: true,
      data: cartListProducts,
      statusCode: httpStatus.OK,
    };
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    next(error);
  }
};
