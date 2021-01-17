import * as express from 'express';
import { getAllUsers } from '../../controller/v1/user.controller';

const router = express.Router();

router.get('/users', getAllUsers);

export default router;
