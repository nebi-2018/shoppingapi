import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Product } from "../../models/product";

it("fetches the order", async () => {
  // Create a product
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 40,
  });
  await product.save();
  const user = global.signin();
  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);
  // Make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
