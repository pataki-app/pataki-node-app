import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '../models/model.type';
import { ErrorAuth } from '../models/auth.type';
import { RoleUser, ErrorUser } from '../models/user.type';

interface RequestUser extends Request {
  user?: any;
}

export const isAuth = (
  req: RequestUser,
  res: Response,
  next: NextFunction
): void => {
  const token = req.get('Authorization');
  if (token) {
    const seed = process.env.SEED || '10';
    jwt.verify(token, seed, (error, decoded) => {
      if (error) {
        const errorResponse: ResponseError = error;
        errorResponse.statusCode = 401;
        next(errorResponse);
      }
      req.user = decoded;
      next();
    });
  } else {
    const error: ResponseError = new Error(ErrorAuth.InvalidToken);
    error.statusCode = 401;
    next(error);
  }
};

export const isAdmin = (
  req: RequestUser,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;
  if (user.role === RoleUser.admin) {
    next();
  } else {
    const error: ResponseError = new Error(ErrorUser.InvalidUserRol);
    error.statusCode = 401;
    next(error);
  }
};
