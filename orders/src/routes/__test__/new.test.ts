import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Product } from "../../models/product";
import { OrderStatus } from "@washera/common";
import { natsWrapper } from "../../nats-wrapper";

// it("returns an error if the product doesnt exist", async () => {
//   const productId = new mongoose.Types.ObjectId();

//   await request(app)
//     .post("/api/orders")
//     .set("Cookie", global.signin())
//     .send({
//       productId,
//     })
//     .expect(404);
// });

it("reserves a product", async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await product.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(201);
});

// it("emits an order created event", async () => {
//   const product = Product.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     title: "concert",
//     price: 20,
//     code: "12345",
//     image: "",
//   });

//   await product.save();

//   await request(app)
//     .post("/api/orders")
//     .set("Cookie", global.signin())
//     .send({ productId: product.id })
//     .expect(201);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
