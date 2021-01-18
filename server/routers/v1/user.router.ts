import * as express from 'express';
import { getAllUsers, createUser } from '../../controllers/v1/user.controller';
import {
  createUserValidation,
  validator,
} from '../../validations/user.validation';

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/user', createUserValidation(), validator, createUser);

export default router;
