import { Request, Response } from 'express';

const data_example = [
  {
    id: 123,
    user: 'admin',
    role: 'ROLE_ADMIN',
  },
  {
    id: 124,
    user: 'user',
    role: 'ROLE_USER',
  },
];

export const getAllUsers = (req: Request, res: Response): void => {
  res.json({
    ok: true,
    data: data_example,
  });
};
