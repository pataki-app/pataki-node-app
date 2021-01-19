import * as mongoose from 'mongoose';
import { body, ValidationChain } from 'express-validator';
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

export { createUserValidation };
