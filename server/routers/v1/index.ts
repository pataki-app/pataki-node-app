import { Express } from 'express';
import userRouter from './user.router';
import loginRouter from './login.router';

export const generateRouters = (app: Express): void => {
  app.use('/api/v1', userRouter);
  app.use('/api/v1', loginRouter);
};
