import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@washera/common";
import { Product } from "../models/products";
import { ProductCreatedPublisher } from "../events/pulishers/product-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/products",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, code, image } = req.body;

    const product = Product.build({
      title,
      price,
      code,
      image,
      userId: req.currentUser!.id,
    });

    await product.save();

    // new ProductCreatedPublisher(natsWrapper.client).publish({
    //   id: product.id,
    //   title: product.title,
    //   price: product.price,
    //   code: product.code,
    //   image: product.image,
    //   userId: product.userId,
    // });
    res.status(201).send(product);
  }
);

export { router as createProductRouter };
