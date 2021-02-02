import { Request, Response, NextFunction } from 'express';
import { CallbackError } from 'mongoose';
import * as httpStatus from 'http-status';
import CategoryModel from '../../models/category.model';
import ProductModel, { ProductDoc } from '../../models/product.model';
import { errorHandler } from '../../validations/error.validation';
import { ResponseApi, ResponseError } from '../../models/model.type';
import { ErrorProduct } from '../../models/product.type';

export interface ProductRequest extends Request {
  docProduct: ProductDoc;
  files?: {
    image: any;
  };
}

export const setProductId = (
  req: ProductRequest,
  res: Response,
  next: NextFunction,
  id: number
): void => {
  ProductModel.findById(id).exec((error: CallbackError, item: ProductDoc) => {
    if (error) return errorHandler(error, next, item);
    req.docProduct = item;
    next();
  });
};

export const createProduct = async (
  req: ProductRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const modelProduct = new ProductModel(req.body);

  // validate file
  if (req.files && req.files.image) {
    if (req.files.image.size > 10000000) {
      const error: ResponseError = new Error(ErrorProduct.InvalidSizeExceeded);
      error.statusCode = httpStatus.REQUEST_ENTITY_TOO_LARGE;
      return next(error);
    } else {
      modelProduct.image = {
        data: req.files.image.data,
        contentType: req.files.image.mimetype,
      };
    }
  }

  // validate category
  const response = await CategoryModel.exists({ name: req.body.category });
  if (!response) {
    const response: ResponseApi = {
      isOk: false,
      message: ErrorProduct.InvalidCategory,
      statusCode: httpStatus.OK,
      data: null,
    };
    res.status(httpStatus.OK).json(response);
  }

  // validate value of discount
  if (modelProduct.discount?.isDiscount) {
    if (!modelProduct.discount?.percentDiscount) {
      const response: ResponseApi = {
        isOk: true,
        message: ErrorProduct.NotPercentDiscount,
        statusCode: httpStatus.BAD_REQUEST,
        data: null,
      };
      res.status(httpStatus.BAD_REQUEST).json(response);
    }
    const discount = modelProduct.discount.percentDiscount;
    const value = (discount * modelProduct.value) / 100;
    modelProduct.discount.valueDiscount = modelProduct.value - value;
  } else {
    modelProduct.discount = {
      isDiscount: false,
      percentDiscount: 0,
      valueDiscount: modelProduct.discount.valueDiscount,
    };
  }

  // save product
  modelProduct.save((error: CallbackError, item: ProductDoc) => {
    // Error response
    if (error || !item) return errorHandler(error, next, item);
    // Ok response
    const data = item.toObject();
    if (data.image) delete data.image;

    const response: ResponseApi = {
      isOk: true,
      data,
      statusCode: httpStatus.CREATED,
    };
    res.status(httpStatus.CREATED).json(response);
  });
};

export const allProducts = (
  req: ProductRequest,
  res: Response,
  next: NextFunction
): void => {
  ProductModel.find({ available: true }).exec(
    (error: CallbackError, items: ProductDoc[]) => {
      if (error) return errorHandler(error, next, items);
      if (items) {
        items = items.map((product) => {
          product.image = undefined;
          return product;
        });
      }
      const response: ResponseApi = {
        isOk: true,
        data: items,
        statusCode: httpStatus.OK,
      };
      res.status(httpStatus.OK).json(response);
    }
  );
};

export const updateProduct = (
  req: ProductRequest,
  res: Response,
  next: NextFunction
): void => {
  const data = { ...req.body };
  const discount = {
    isDiscount: req.body.discount?.isDiscount,
    percentDiscount: req.body.discount?.percentDiscount,
    valueDiscount: 0,
  };

  let newDiscount = { ...req.docProduct.discount };

  // when product is false and update with promotion discount true
  if (discount?.isDiscount) {
    // validate percent discount too
    const discountPercent = discount.percentDiscount;
    if (discountPercent) {
      const value = (discountPercent * req.docProduct.value) / 100;
      newDiscount = {
        isDiscount: true,
        percentDiscount: discountPercent,
        valueDiscount: req.docProduct.value - value,
      };
    } else {
      const response: ResponseApi = {
        isOk: true,
        message: ErrorProduct.NotPercentDiscount,
        statusCode: httpStatus.BAD_REQUEST,
        data: null,
      };
      res.status(httpStatus.BAD_REQUEST).json(response);
    }
  } else {
    newDiscount = {
      isDiscount: false,
      percentDiscount: 0,
      valueDiscount: req.docProduct.value,
    };
  }

  data.discount = newDiscount;

  ProductModel.findByIdAndUpdate(
    req.docProduct._id,
    data,
    { new: true },
    (error, item) => {
      if (error || !item) return errorHandler(error, next, item);
      const response: ResponseApi = {
        isOk: true,
        data: item,
        statusCode: httpStatus.OK,
      };
      res.status(httpStatus.OK).json(response);
    }
  );
};

export const removeProduct = (
  req: ProductRequest,
  res: Response,
  next: NextFunction
): void => {
  req.docProduct.available = false;
  req.docProduct.save((error, item) => {
    if (error || !item) return errorHandler(error, next, item);
    const response: ResponseApi = {
      isOk: true,
      data: item,
      statusCode: httpStatus.OK,
    };
    res.status(httpStatus.OK).json(response);
  });
};

export const getProductByCategory = (
  req: ProductRequest,
  res: Response,
  next: NextFunction
): void => {
  ProductModel.find({ category: req.params.category }).exec(
    (error: CallbackError, items: ProductDoc[]) => {
      if (error || !items) return errorHandler(error, next, items);
      if (items) {
        items = items.map((product) => {
          product.image = undefined;
          return product;
        });
      }
      const response: ResponseApi = {
        isOk: true,
        data: items,
        statusCode: httpStatus.OK,
      };
      res.status(httpStatus.OK).json(response);
    }
  );
};

export const getImageById = (req: ProductRequest, res: Response): void => {
  if (req.docProduct.image?.data) {
    res.set('Content-Type', req.docProduct.image?.contentType);
    res.send(req.docProduct.image?.data);
  } else {
    const response: ResponseApi = {
      isOk: true,
      data: null,
      statusCode: httpStatus.NOT_FOUND,
      message: httpStatus['404_MESSAGE'],
    };
    res.status(httpStatus.NOT_FOUND).json(response);
  }
};

export const getProductById = (req: ProductRequest, res: Response): void => {
  const response: ResponseApi = {
    isOk: true,
    data: req.docProduct,
    statusCode: httpStatus.OK,
  };
  res.json(response);
};
