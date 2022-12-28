import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@washera/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/products";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const product = Product.build({
    title: "concert",
    price: 99,
    code: "12345",
    image: "",
    userId: "sdbjfb",
  });

  await product.save();

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "bfjbsjdbfjbj",
    product: {
      id: product.id,
      price: product.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, product };
};

it("sets the userid of the product", async () => {
  const { listener, data, product, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.orderId).toEqual(data.id);
});
it("accks the message", async () => {
  const { listener, data, product, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a product updated event", async () => {
  const { listener, data, product, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
