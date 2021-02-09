import { Express } from 'express';
import userRouter from './user.router';
import loginRouter from './login.router';
import categoryRouter from './category.router';
import productRouter from './product.router';
import cartRouter from './cart.router';
import evaluationRouter from './evaluation.router';
import orderRouter from './order.router';

export const generateRouters = (app: Express): void => {
  app.use('/api/v1', userRouter);
  app.use('/api/v1', loginRouter);
  app.use('/api/v1', categoryRouter);
  app.use('/api/v1', productRouter);
  app.use('/api/v1', cartRouter);
  app.use('/api/v1', evaluationRouter);
  app.use('/api/v1', orderRouter);
};
