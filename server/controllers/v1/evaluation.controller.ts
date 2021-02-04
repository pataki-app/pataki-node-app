import { Request, Response, NextFunction } from 'express';
import { CallbackError } from 'mongoose';
import * as httpStatus from 'http-status';
import EvaluationModel from '../../models/evaluation.model';
import { ErrorEvaluation, ValidEvaluation } from '../../models/evaluation.type';
import { ResponseApi } from '../../models/model.type';
import { errorHandler } from '../../validations/error.validation';
import ProductModel, { ProductDoc } from '../../models/product.model';
import UserModel, { UserDoc } from '../../models/user.model';

export interface EvaluationRequest extends Request {
  docProduct: ProductDoc;
  docUser: UserDoc;
}

export const getEvaluationByProduct = (
  req: EvaluationRequest,
  res: Response,
  next: NextFunction
): any => {
  EvaluationModel.find({ product: req.docProduct }).exec(
    (error: CallbackError, items: ProductDoc[]) => {
      if (error || !items) return errorHandler(error, next, items);
      const response: ResponseApi = {
        isOk: true,
        data: items,
        statusCode: httpStatus.OK,
      };
      res.status(httpStatus.OK).json(response);
    }
  );
};

export const createEvaluation = async (
  req: EvaluationRequest,
  res: Response
): Promise<void> => {
  const data = {
    product: req.body.product,
    user: req.body.user,
    point: req.body.point,
    comment: req.body.comment,
  };

  let createEvaluation = true;

  if (
    (data.point && parseInt(data.point) > 5) ||
    (data.point && parseInt(data.point) < 1)
  ) {
    const response: ResponseApi = {
      isOk: false,
      message: ErrorEvaluation.InvalidPoint,
      data: null,
      statusCode: httpStatus.BAD_REQUEST,
    };
    res.status(httpStatus.BAD_REQUEST).json(response);
    createEvaluation = false;
  }

  if (data.product && data.user) {
    // User validation
    const user: UserDoc = await UserModel.findById(data.user).exec();
    if (user) {
      user.password = undefined;
      req.docUser = user;
    } else {
      const response: ResponseApi = {
        isOk: false,
        message: ErrorEvaluation.InvalidUser,
        data: null,
        statusCode: httpStatus.BAD_REQUEST,
      };
      res.status(httpStatus.BAD_REQUEST).json(response);
      createEvaluation = false;
    }

    // Product validation
    const product: ProductDoc = await ProductModel.findById(
      data.product
    ).exec();
    if (product) {
      product.image = undefined;
      req.docProduct = product;
    } else {
      const response: ResponseApi = {
        isOk: false,
        message: ErrorEvaluation.InvalidProduct,
        data: null,
        statusCode: httpStatus.BAD_REQUEST,
      };
      res.status(httpStatus.BAD_REQUEST).json(response);
      createEvaluation = false;
    }
  } else {
    const response: ResponseApi = {
      isOk: false,
      message: ErrorEvaluation.InvalidProduct,
      data: null,
      statusCode: httpStatus.BAD_REQUEST,
    };
    res.status(httpStatus.BAD_REQUEST).json(response);
    createEvaluation = false;
  }

  if (createEvaluation) {
    const responseCreate = await new EvaluationModel(data).createEvaluation(
      req.docProduct
    );

    if (responseCreate) {
      const response: ResponseApi = {
        isOk: true,
        message: ValidEvaluation.EvaluationCreated,
        data,
        statusCode: httpStatus.CREATED,
      };
      res.status(httpStatus.CREATED).json(response);
    } else {
      const response: ResponseApi = {
        isOk: false,
        data: null,
        statusCode: httpStatus.BAD_REQUEST,
      };
      res.status(httpStatus.BAD_REQUEST).json(response);
    }
  }
};
