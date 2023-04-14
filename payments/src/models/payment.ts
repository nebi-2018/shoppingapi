import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  transactionId: string;
  // stripeId: string;
  // paymentIntentId: string;
  // clientsecret: string | null;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  transactionId: string;
  // stripeId: string;
  // paymentIntentId: string;
  // clientsecret: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    // stripeId: {
    //   type: String,
    //   required: true,
    // },
    // paymentIntentId: {
    //   type: String,
    //   required: true,
    // },
    // clientsecret: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
