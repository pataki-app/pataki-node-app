import { body, ValidationChain } from 'express-validator';
import { ErrorUser } from '../models/user.type';

export const loginValidation = (): ValidationChain[] => [
  body('email').trim().not().isEmpty().withMessage(ErrorUser.EmailRequired),
  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage(ErrorUser.PasswordRequired),
];
