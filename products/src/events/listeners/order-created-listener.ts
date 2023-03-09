import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@washera/common";
import { queueGroupName } from "./queue-group-name";
import { Product } from "../../models/products";
import { ProductUpdatedPublisher } from "../pulishers/product-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //     // Find the product that the order is reserving
    //     const product = await Product.findById(data.product.id);
    //     // If no product throw an error
    //     if (!product) {
    //       throw new Error("Product not found");
    //     }
    //     // Mark the product as being reserved by setting its orderid property
    //     product.set({ orderId: data.id });
    //     // Save the product
    //     await product.save();
    //     await new ProductUpdatedPublisher(this.client).publish({
    //       id: product.id,
    //       title: product.title,
    //       price: product.price,
    //       code: product.code,
    //       image: product.image,
    //       userId: product.userId,
    //       orderId: product.orderId,
    //     });
    //     // Ack the message
    msg.ack();
  }
}
