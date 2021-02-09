import { Request, Response, NextFunction } from 'express';
import * as httpStatus from 'http-status';
import OrderModel, { OrderDoc } from '../../models/order.model';
import { ErrorOrder } from '../../models/order.type';
import Cart, { IProduct, ICart } from '../../session/cart.model';
import { ResponseApi } from '../../models/model.type';
import UserModel, { UserDoc } from '../../models/user.model';
import { ErrorUser } from '../../models/user.type';

interface OrderRequest extends Request {
  docUser: UserDoc;
  session: any;
}

export const createOrder = async (
  req: OrderRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = req.session.cart ? new Cart(req.session.cart) : null;
    if (!cart) {
      const response: ResponseApi = {
        isOk: false,
        data: null,
        message: ErrorOrder.VoidCart,
        statusCode: httpStatus.BAD_REQUEST,
      };
      res.status(httpStatus.BAD_REQUEST).json(response);
    } else {
      const userId = req.params.userId;
      req.docUser = await UserModel.findById(userId).exec();

      if (!req.docUser) {
        const response: ResponseApi = {
          isOk: false,
          data: null,
          message: ErrorUser.NotFound,
          statusCode: httpStatus.BAD_REQUEST,
        };
        res.status(httpStatus.BAD_REQUEST).json(response);
      } else {
        req.docUser.cart.items = cart.items;
        await req.docUser.save();
        req.session.cart = null;
        const data = {
          user: {
            name: req.docUser.name,
            email: req.docUser.email,
            userId: req.docUser.id,
          },
          total: 0,
        };
        const response = await new OrderModel(data).createOrder(req.docUser);

        if (response) {
          const response: ResponseApi = {
            isOk: false,
            data: null,
            statusCode: httpStatus.OK,
          };
          res.status(httpStatus.OK).json(response);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
