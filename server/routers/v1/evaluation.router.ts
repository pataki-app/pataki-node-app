import * as express from 'express';
import {
  createEvaluation,
  getEvaluationByProduct,
} from '../../controllers/v1/evaluation.controller';
import { setProductId } from '../../controllers/v1/product.controller';

const router = express.Router();

router.param('productId', setProductId);

router.post('/evaluation', createEvaluation);
router.get('/evaluation/:productId', getEvaluationByProduct);

export default router;
