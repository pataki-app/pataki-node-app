import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import UserModel from '../../models/user.model';
import { CallbackError, NativeError } from 'mongoose';

interface ResponseError extends Error {
  status?: number;
}

const errorHandler = (
  err: NativeError | null,
  next: NextFunction,
  item: any
): void => {
  if (err) return next(err);
  if (!item) {
    const error: ResponseError = new Error('Usuario o password incorrecto');
    error.status = 500;
    return next(error);
  }
};

const data_example = [
  {
    id: 123,
    user: 'admin',
    role: 'ROLE_ADMIN',
  },
  {
    id: 124,
    user: 'user',
    role: 'ROLE_USER',
  },
];

export const getAllUsers = (req: Request, res: Response): void => {
  res.json({
    result: true,
    data: data_example,
  });
};

export const createUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const saltOrRounds = parseInt(process.env.SALT || '10');
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltOrRounds),
    role: req.body.role,
  };
  const modelUser = new UserModel(data);
  modelUser.save((error: CallbackError, item) => {
    if (error || !item) return errorHandler(error, next, item);
    res.json({
      result: true,
      data: item,
    });
  });
};
