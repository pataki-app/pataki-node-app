import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as httpStatus from 'http-status';
import { ErrorAuth } from '../models/auth.type';
import { RoleUser, ErrorUser } from '../models/user.type';
import { ResponseApi } from '../models/model.type';

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
        const response: ResponseApi = {
          isOk: false,
          data: null,
          statusCode: httpStatus.UNAUTHORIZED,
          message: error.message,
        };
        res.status(httpStatus.UNAUTHORIZED).json(response);
      }
      req.user = decoded;
      next();
    });
  } else {
    const response: ResponseApi = {
      isOk: false,
      data: null,
      statusCode: httpStatus.UNAUTHORIZED,
      message: ErrorAuth.InvalidToken,
    };
    res.status(httpStatus.UNAUTHORIZED).json(response);
  }
};

export const isAdmin = (
  req: RequestUser,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;
  if (user && user.role === RoleUser.admin) {
    next();
  } else {
    const response: ResponseApi = {
      isOk: false,
      data: null,
      statusCode: httpStatus.UNAUTHORIZED,
      message: ErrorUser.InvalidUserRol,
    };
    res.status(httpStatus.UNAUTHORIZED).json(response);
  }
};
