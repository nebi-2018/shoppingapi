import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIP_KEY!, {
  apiVersion: "2022-08-01",
});
