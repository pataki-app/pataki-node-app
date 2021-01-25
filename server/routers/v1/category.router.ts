import * as express from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  setCategoryId,
} from '../../controllers/v1/category.controller';
import { isAuth, isAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

router.all('/category/*', isAuth, isAdmin);

router.param('categoryId', setCategoryId);

router.get('/category', getAllCategories);
router.post('/category', createCategory);
router.put('/category/:categoryId', updateCategory);
router.delete('/category/:categoryId', deleteCategory);

export default router;
