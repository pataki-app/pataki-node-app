import { NativeError } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as httpStatus from 'http-status';
import { ResponseError } from '../models/model.type';

// Generic Error
export const errorHandler = (
  error: NativeError | null,
  next: NextFunction,
  item: any
): void => {
  if (error) return next(error);
  if (!item) {
    const error: ResponseError = new Error('ERROR_500');
    error.status = httpStatus.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

// Validator function (express-validator)
export const validator = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<any> | void => {
  const errors = validationResult(req).formatWith(({ msg, param, value }) => ({
    error: msg,
    param,
    value,
  }));
  if (!errors.isEmpty()) {
    console.log('error validation');
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
