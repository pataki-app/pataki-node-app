import * as express from 'express';
import {
  getAllUsers,
  createUser,
  getUserById,
  setUserId,
} from '../../controllers/v1/user.controller';
import { createUserValidation } from '../../validations/user.validation';
import { validator } from '../../validations/error.validation';
import { isAuth, isAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

router.all('/user/*', isAuth, isAdmin);

router.param('userId', setUserId);

router.get('/user/users', getAllUsers);
router.get('/user/:userId', getUserById);
router.post('user/create', createUserValidation(), validator, createUser);

export default router;
