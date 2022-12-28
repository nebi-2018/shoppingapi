import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@washera/common";
import { OrderStatus } from "@washera/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    console.log(req.body);
    console.log(req.params);
    console.log("Hello delete");
    const { orderId } = req.params;
    //await Order.findByIdAndDelete(req.params.id);
    console.log(orderId);
    const order = await Order.findByIdAndDelete(orderId);
    console.log(order);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // new OrderCancelledPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   product: {
    //     id: order.products.id,
    //   },
    // });
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
