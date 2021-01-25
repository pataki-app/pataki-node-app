import { Request, Response, NextFunction } from 'express';
import { CallbackError } from 'mongoose';
import CategoryModel, { CategoryDoc } from '../../models/category.model';
import { errorHandler } from '../../validations/error.validation';
import { ResponseApi } from '../../models/model.type';

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
      statusCode: 200,
    };
    res.json(response);
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
      statusCode: 200,
    };
    res.json(response);
  });
};

export const updateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = req.params.id;
  const data = {
    name: req.body.name,
  };
  CategoryModel.findByIdAndUpdate(id, data, { new: true }, (error, item) => {
    // Error response
    if (error || !item) return errorHandler(error, next, item);

    // Ok response
    const response: ResponseApi = {
      isOk: true,
      data: item,
      statusCode: 200,
    };
    res.json(response);
  });
};

export const deleteCategory = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = req.params.id;
  CategoryModel.findByIdAndRemove(id, {}, (error, item) => {
    // Error response
    if (error || !item) return errorHandler(error, next, item);
    // Ok response
    const response: ResponseApi = {
      isOk: true,
      data: item,
      statusCode: 200,
    };
    res.json(response);
  });
};
