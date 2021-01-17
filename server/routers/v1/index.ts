import { Express } from 'express';
import userRouter from './user.router';

export const generateRouters = (app: Express): void => {
  app.use('/api/v1', userRouter);
};
