import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { CallbackError } from 'mongoose';
import * as httpStatus from 'http-status';
import UserModel, { UserDoc } from '../../models/user.model';
import { ValidUser } from '../../models/user.type';
import { ResponseApi } from '../../models/model.type';
import { errorHandler } from '../../validations/error.validation';

interface UserRequest extends Request {
  docUser: UserDoc;
}

export const getAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  UserModel.find().exec((error: CallbackError, item: UserDoc[]) => {
    // Error response
    if (error || !item) return errorHandler(error, next, item);
    if (item) {
      item = item.map((user) => {
        user.password = undefined;
        return user;
      });
    }
    // Ok response
    const response: ResponseApi = {
      isOk: true,
      data: item,
      statusCode: httpStatus.OK,
    };
    res.status(httpStatus.OK).json(response);
  });
};

export const setUserId = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
  id: number
): void => {
  UserModel.findById(id)
    /* .where({ available: true }) */
    .exec((error: CallbackError, item: UserDoc) => {
      if (error) return errorHandler(error, next, item);
      req.docUser = item;
      next();
    });
};

export const getUserById = (req: UserRequest, res: Response): void => {
  const response: ResponseApi = {
    isOk: true,
    data: req.docUser,
    statusCode: httpStatus.OK,
  };
  res.status(httpStatus.OK).json(response);
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
    // Error response
    if (error || !item) return errorHandler(error, next, item);
    // Ok response
    const response: ResponseApi = {
      isOk: true,
      message: ValidUser.UserCreated,
      data: item,
      statusCode: httpStatus.CREATED,
    };
    res.status(httpStatus.CREATED).json(response);
  });
};
