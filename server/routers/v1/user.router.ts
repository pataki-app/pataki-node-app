import * as express from 'express';
import { getAllUsers, createUser } from '../../controllers/v1/user.controller';

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/user', createUser);

export default router;
