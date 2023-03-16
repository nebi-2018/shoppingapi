import { Request, Response, NextFunction } from "express";
import {
  requireAuth,
  BadRequestError,
  validateRequest,
  NotFoundError,
  OrderStatus,
  NotAuthorizedError,
} from "@washera/common";
import { User } from "./models/user";
import { Order } from "./models/order";
import { Card } from "./models/card";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = User.findById(req.currentUser!.id);

  if (!user) {
    throw new NotFoundError();
  }
};
