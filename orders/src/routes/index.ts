import express, { Request, Response } from "express";
import { requireAuth } from "@washera/common";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.findOne({ userId: req.currentUser!.id }).populate(
    "products"
  );
  const orderss = await Order.find({ userId: req.currentUser!.id }).populate(
    "products"
  );
  res.send(orderss);
});

export { router as indexOrderRouter };
