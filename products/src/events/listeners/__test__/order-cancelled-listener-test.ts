import { OrderCancelledListener } from "../order-cancelled-listener";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@washera/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/products";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const product = Product.build({
    title: "concert",
    price: 99,
    code: "12345",
    image: "",
    userId: "sdbjfb",
  });

  product.set({ orderId });

  await product.save();

  // Create the fake data event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    product: {
      id: product.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { orderId, data, msg, product, listener };
};

it("updates the ticket,publishes an event, and acks the message", async () => {
  const { listener, data, product, msg, orderId } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Product.findById(product.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
