import { OrderStatus } from "@washera/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";
import { Order } from "./order";

interface ProductAttrs {
  id: string;
  title: string;
  price: number;
  code: string;
  image: string;
}

export interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  code: string;
  image: string;
  isReserved(): Promise<boolean>;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
  findByEvent(event: { id: string }): Promise<ProductDoc | null>;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    code: {
      type: String,
      required: true,
    },
    image: {
      type: String,
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

// productSchema.set("versionKey", "version");
// productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.findByEvent = (event: { id: string }) => {
  return Product.findOne({
    _id: event.id,
  });
};
productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    code: attrs.code,
    image: attrs.image,
  });
};

productSchema.methods.isReserved = async function () {
  // this === the product document that we just called 'isReserved' on
  // Run query to look at all orders. Find an order where the product
  // is the product we just found and the order status is not cancelled
  // If we find an order from that means the product is reserved
  const existingOrder = await Order.findOne({
    product: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
