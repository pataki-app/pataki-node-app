import * as express from 'express';
import { createOrder } from '../../controllers/v1/order.controller';
import { isAuth } from '../../middleware/auth.middleware';

const router = express.Router();

router.all('/order/*', isAuth);

router.get('/order/create/:userId', createOrder);

export default router;
