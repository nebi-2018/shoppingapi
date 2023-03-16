import mongoose from "mongoose";
import { OrderStatus } from "@washera/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ProductDoc } from "./product";
import { Types } from "mongoose";

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  products: Items[];
  amount: number;
  dateTime: string;
  // transactionId: string;
}

interface Items {
  product: ProductDoc;
  quantity: number;
  price: string;
  title: string;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  products: Types.DocumentArray<Items>;
  amount: number;
  dateTime: string;
  // transactionId: string;
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
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity can not be less then 1."],
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    amount: { type: Number },
    //transactionId: { type: String },
    dateTime: { type: String },
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
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
