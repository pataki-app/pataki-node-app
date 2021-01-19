import * as mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import UserModel from '../models/user.model';
import { ErrorUser } from '../models/user.type';

const createUserValidation = (): ValidationChain[] => [
  body('name').trim().not().isEmpty().withMessage(ErrorUser.NameRequired),
  body('email').trim().not().isEmpty().withMessage(ErrorUser.EmailRequired),
  body('email')
    .isEmail()
    .withMessage(ErrorUser.EmailInvalid)
    .custom(async (value) => {
      const userExist = await UserModel.findOne({ email: value });
      if (userExist) return mongoose.Promise.reject(ErrorUser.EmailDuplicate);
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage(ErrorUser.PasswordRequired),
  body('password').isLength({ min: 8 }).withMessage(ErrorUser.PasswordMin),
  body('password')
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])/)
    .withMessage(ErrorUser.PasswordFormat),
];

const validator = (
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
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { validator, createUserValidation };
