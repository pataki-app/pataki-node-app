import { Request, Response, NextFunction } from 'express';
import { CallbackError } from 'mongoose';
import * as httpStatus from 'http-status';
import CategoryModel, { CategoryDoc } from '../../models/category.model';
import { errorHandler } from '../../validations/error.validation';
import { ResponseApi } from '../../models/model.type';

interface CategoryRequest extends Request {
  docCategory: CategoryDoc;
}

export const setCategoryId = (
  req: CategoryRequest,
  res: Response,
  next: NextFunction,
  id: number
): void => {
  CategoryModel.findById(id).exec((error: CallbackError, item: CategoryDoc) => {
    if (error) return errorHandler(error, next, item);
    req.docCategory = item;
    next();
  });
};

export const createCategory = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const data = { name: req.body.name };
  const modelCategoria = new CategoryModel(data);
  modelCategoria.save((error: CallbackError, item: CategoryDoc) => {
    // Error response
    if (error || !item) return errorHandler(error, next, item);
    // Ok response
    const response: ResponseApi = {
      isOk: true,
      data: item,
      statusCode: httpStatus.CREATED,
    };
    res.status(httpStatus.CREATED).json(response);
  });
};

export const getAllCategories = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  CategoryModel.find().exec((error: CallbackError, item: CategoryDoc) => {
    // Error response
    if (error || !item) return errorHandler(error, next, item);
    // Ok response
    const response: ResponseApi = {
      isOk: true,
      data: item,
      statusCode: httpStatus.OK,
    };
    res.status(httpStatus.OK).json(response);
  });
};

export const updateCategory = (
  req: CategoryRequest,
  res: Response,
  next: NextFunction
): void => {
  // const id = req.params.id;
  console.log('req.docCategory', req.docCategory);
  const data = {
    name: req.body.name,
  };
  CategoryModel.findByIdAndUpdate(
    req.docCategory._id,
    data,
    { new: true },
    (error, item) => {
      // Error response
      if (error || !item) return errorHandler(error, next, item);

      // Ok response
      const response: ResponseApi = {
        isOk: true,
        data: item,
        statusCode: httpStatus.OK,
      };
      res.status(httpStatus.OK).json(response);
    }
  );
};

export const deleteCategory = (
  req: CategoryRequest,
  res: Response,
  next: NextFunction
): void => {
  CategoryModel.findByIdAndRemove(req.docCategory._id, {}, (error, item) => {
    // Error response
    if (error || !item) return errorHandler(error, next, item);
    // Ok response
    const response: ResponseApi = {
      isOk: true,
      data: item,
      statusCode: httpStatus.OK,
    };
    res.status(httpStatus.OK).json(response);
  });
};
