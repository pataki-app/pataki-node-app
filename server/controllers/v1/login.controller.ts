import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { CallbackError } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as httpStatus from 'http-status';
import UserModel, { UserDoc } from '../../models/user.model';
import { ValidUser, ErrorUser, RoleUser } from '../../models/user.type';
import { ResponseApi } from '../../models/model.type';
import { errorHandler } from '../../validations/error.validation';

const responseLogin = (item: UserDoc): ResponseApi => {
  const seed = process.env.SEED || '10';
  const expiresIn = process.env.EXPIRES_IN || '1h';
  const payload = {
    userId: item._id,
    role: item.role,
  };
  const token = jwt.sign(payload, seed, { expiresIn });
  const user = item.toObject();
  if (user.password) delete user.password;

  const response: ResponseApi = {
    isOk: true,
    statusCode: httpStatus.OK,
    message: ValidUser.UserLogin,
    data: {
      user,
      token: token,
    },
  };
  return response;
};

export const login = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  UserModel.findOne(
    { email: req.body.email },
    (error: CallbackError, item: UserDoc) => {
      const invalidResponse: ResponseApi = {
        isOk: false,
        message: ErrorUser.InvalidUserOrPassword,
        statusCode: httpStatus.UNAUTHORIZED,
        data: null,
      };
      // Error response
      if (error) return errorHandler(error, next, item);
      if (!item || !bcrypt.compareSync(data.password, item.password || '')) {
        return res.status(httpStatus.UNAUTHORIZED).json(invalidResponse);
      }

      // Ok response
      const response = responseLogin(item);
      res.json(response);
    }
  );
};

export const signUp = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const saltOrRounds = parseInt(process.env.SALT || '10');
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltOrRounds),
    role: RoleUser.user,
  };
  const modelUser = new UserModel(data);
  modelUser.save((error: CallbackError, item) => {
    // Error response
    if (error || !item) return errorHandler(error, next, item);
    // Ok response
    const response = responseLogin(item);
    res.json(response);
  });
};

export const logout = (req: Request, res: Response): void => {
  if (req.session) {
    req.session.destroy(() => {
      const response: ResponseApi = {
        isOk: true,
        statusCode: httpStatus.OK,
        message: 'DESTROY_SESSION',
        data: null,
      };
      res.json(response);
    });
  }
};
