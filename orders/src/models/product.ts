import { OrderStatus } from "@washera/common";
import { Types } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";
import { Order } from "./order";

interface ProductAttrs {
  id: string;
  title: string;
  price: number;
}

// interface Products {
//   title: string;
//   price: number;
//   quantity: number;
// }

// interface Itemss {
//   id: Types.ObjectId;
//   title: string;
//   price: number;
//   quantity: number;
// }

// export interface ProductDoc extends mongoose.Document {
//   title: string;
//   price: number;
//   isReserved(): Promise<boolean>;
// }

export interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
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

productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

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
  });
};

// productSchema.statics.build = (attrs: ProductAttrs) => {
//   return new Product({
//     _id: attrs.id,
//     products: attrs.products,
//   });
// };

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
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
