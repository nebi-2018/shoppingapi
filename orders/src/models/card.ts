import mongoose from "mongoose";
import { OrderStatus } from "@washera/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ProductDoc } from "./product";
import { Types } from "mongoose";

interface CardsAttrs {
  cardName: string;
  cardNumber: string;
  cardEXPMonth: string;
  cardExpYear: string;
  cardCVC: string;
  cardId: string;
  customerId: string;
}

interface CardsDoc extends mongoose.Document {
  cardName: string;
  cardNumber: string;
  cardEXPMonth: string;
  cardExpYear: string;
  cardCVC: string;
  cardId: string;
  customerId: string;
}

interface CardModel extends mongoose.Model<CardsDoc> {
  build(attrs: CardsAttrs): CardsDoc;
}

const cardSchema = new mongoose.Schema(
  {
    cardName: {
      type: String,
      required: false,
    },
    cardNumber: {
      type: String,
      required: true,
      unique: true,
    },
    cardEXPMonth: {
      type: String,
      required: true,
    },
    cardEXPYear: {
      type: String,
      required: true,
    },
    cardCVC: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    cardId: {
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

cardSchema.set("versionKey", "version");
cardSchema.plugin(updateIfCurrentPlugin);

cardSchema.statics.build = (attrs: CardsAttrs) => {
  return new Card(attrs);
};

const Card = mongoose.model<CardsDoc, CardModel>("Order", cardSchema);

export { Card };
