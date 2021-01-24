import * as express from 'express';
import { login, signUp, logout } from '../../controllers/v1/login.controller';
import { loginValidation } from '../../validations/login.validation';
import { createUserValidation } from '../../validations/user.validation';
import { validator } from '../../validations/error.validation';

const router = express.Router();

router.post('/login', loginValidation(), validator, login);
router.post('/signup', createUserValidation(), validator, signUp);
router.get('/logout', logout);

export default router;
