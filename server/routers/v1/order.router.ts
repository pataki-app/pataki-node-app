import * as express from 'express';
import { createOrder, orderList } from '../../controllers/v1/order.controller';
import { isAuth } from '../../middleware/auth.middleware';

const router = express.Router();

router.all('/order/*', isAuth);

router.get('/order/create/:userId', createOrder);
router.get('/order/list/:userId', orderList);

export default router;
