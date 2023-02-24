import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@washera/common";
import { body } from "express-validator";
import { Product } from "../models/product";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/orders",
  //requireAuth,
  // [
  //   body("productId")
  //     .not()
  //     .isEmpty()
  //     .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  //     .withMessage("Product must be provided"),
  // ],
  //validateRequest,
  async (req: Request, res: Response) => {
    // const { productId } = req.body;
    // console.log("Hello post", productId);
    // const newOrder = new Order(req.body);
    const newOrder = req.body;
    // const savedOrder = await newOrder.save();
    // const orderr = {
    //   amount: req.body.amount,
    //   products: [
    //     req.body.product,
    //     req.body.title,
    //     req.body.price,
    //     req.body.quantity,
    //   ],
    // };
    // // Find the product the user is trying to order in the database
    // const product = await Product.findById(productId);

    // if (!product) {
    //   throw new NotFoundError();
    // }

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      products: newOrder.products,
      amount: newOrder.amount,
      dateTime: newOrder.dateTime,
    });

    await order.save();

    // // Publish an event saying that an order was created

    // new OrderCreatedPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   status: order.status,
    //   userId: order.userId,
    //   product: {
    //     id: product.id,
    //     price: product.price,
    //   },
    // });
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
