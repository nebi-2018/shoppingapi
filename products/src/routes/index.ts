import express, { Request, Response } from "express";
import { Product } from "../models/products";

const router = express.Router();

router.get("/api/products", async (req: Request, res: Response) => {
  if (req.query.code) {
    const code = req.query.code;
    const response = await Product.findOne({ code: code });
    res.json(response).status(200);
  } else {
    const products = await Product.find({});
    res.send(products);
  }
});

export { router as indexProductRouter };
