import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";
import { OrderStatus } from "@washera/common";

interface OrderAttrs {
  id: string;
  userId: string;
  //price: number;
  amount: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  //price: number;
  amount: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    // price: {
    //   type: Number,
    //   required: true,
    // },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    amount: attrs.amount,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
