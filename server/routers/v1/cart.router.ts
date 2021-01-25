import * as express from 'express';
import { setProductId } from '../../controllers/v1/product.controller';
import {
  addProductSession,
  cartListSession,
} from '../../controllers/v1/cart.controller';

const router = express.Router();

router.param('productId', setProductId);

router.get('/cart/session/:productId', addProductSession);
router.get('/cart/session', cartListSession);

export default router;
