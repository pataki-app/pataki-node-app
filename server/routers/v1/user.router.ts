import * as express from 'express';
import {
  getAllUsers,
  createUser,
  getUserById,
  setUserId,
} from '../../controllers/v1/user.controller';
import { createUserValidation } from '../../validations/user.validation';
import { validator } from '../../validations/error.validation';

const router = express.Router();

router.param('userId', setUserId);
router.get('/users', getAllUsers);
router.post('/user', createUserValidation(), validator, createUser);
router.get('/user/:userId', getUserById);

export default router;
