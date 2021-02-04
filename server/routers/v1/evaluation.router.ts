import * as express from 'express';
import {
  createEvaluation,
  getEvaluationByProduct,
} from '../../controllers/v1/evaluation.controller';
import { setProductId } from '../../controllers/v1/product.controller';
import { isAuth } from '../../middleware/auth.middleware';

const router = express.Router();

router.param('productId', setProductId);

router.post('/evaluation', isAuth, createEvaluation);
router.get('/evaluation/:productId', getEvaluationByProduct);

export default router;
