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

// router.all('/product/*', isAuth, isAdmin);

router.param('productId', setProductId);

router.post('/product', createProduct);
router.get('/product', allProducts);
router.get('/product/:productId', getProductById);
router.get('/product/category/:category', getProductByCategory);
router.get('/product/image/:productId', getImageById);
router.put('/product/:productId', updateProduct);
router.delete('/product', removeProduct);

export default router;
