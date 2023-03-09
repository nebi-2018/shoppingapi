import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@washera/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "jfbjkdbf",
    status: OrderStatus.Created,
    amount: 20,
  });

  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    product: {
      id: "djabsjd",
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, order, msg };
};

it("updates the status of the order", async () => {
  const { listener, data, order, msg } = await setup();
  await listener.onMessage(data, msg);

  const updateOrder = await Order.findById(order.id);
  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
