import * as express from 'express';
import {
  createProduct,
  allProducts,
  updateProduct,
  removeProduct,
  getProductByCategory,
  getImageById,
  getProductById,
  setProductId,
} from '../../controllers/v1/product.controller';
import { isAuth, isAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

router.param('productId', setProductId);

router.get('/product', allProducts);
router.get('/product/:productId', getProductById);
router.get('/product/category/:category', getProductByCategory);
router.get('/product/image/:productId', getImageById);
router.post('/product', isAuth, isAdmin, createProduct);
router.put('/product/:productId', isAuth, isAdmin, updateProduct);
router.delete('/product/:productId', isAuth, isAdmin, removeProduct);

export default router;
