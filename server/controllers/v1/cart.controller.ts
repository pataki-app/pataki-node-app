import { Request, Response, NextFunction } from 'express';
import * as httpStatus from 'http-status';
import { ProductDoc } from '../../models/product.model';
import { ErrorProduct } from '../../models/product.type';
import Cart, { IProduct, ICart } from '../../session/cart.model';
import { ResponseApi } from '../../models/model.type';

interface ProductRequest extends Request {
  docProduct: ProductDoc;
  session: any;
}

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
    const cartList: ICart = { ...cart };
    const response: ResponseApi = {
      isOk: true,
      data: cartList,
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
    const cartList: ICart = { ...cart };
    const response: ResponseApi = {
      isOk: true,
      data: cartList,
      statusCode: httpStatus.OK,
    };
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteProductSession = async (
  req: ProductRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.session?.cart?.items?.length > 0) {
      const cart = new Cart(req.session?.cart ? req.session.cart : []);
      const objProduct: IProduct = {
        product: req.docProduct,
        count: 1,
        total: req.docProduct?.value,
      };
      cart.remove(objProduct);
      req.session.cart = cart;
      const cartList: ICart = { ...cart };
      const response: ResponseApi = {
        isOk: true,
        data: cartList,
        statusCode: httpStatus.OK,
      };
      res.status(httpStatus.OK).json(response);
    }
    const response: ResponseApi = {
      isOk: true,
      data: null,
      statusCode: httpStatus.OK,
    };
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    next(error);
  }
};
