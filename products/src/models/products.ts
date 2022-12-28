import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ProductAttrs {
  title: string;
  price: number;
  code: string;
  image: string;
  userId: string;
}

interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  code: string;
  image: string;
  userId: string;
  orderId?: string;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
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
      unique: true,
    },
    image: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
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

productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
