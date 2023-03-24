import Stripe from "stripe";
import { stripe } from "./stripe";
import { Request, Response, NextFunction } from "express";

export async function createCustomer(params: any, callback: any) {
  try {
    const customer = await stripe.customers.create({
      name: params.name,
      email: params.email,
    });
    callback(null, customer);
  } catch (error) {
    return callback(error);
  }
}

export async function addCard(params: any, callback: any) {
  try {
    const card_token = await stripe.tokens.create({
      card: {
        name: params.card_Name,
        number: params.card_Number,
        exp_month: params.card_ExpMonth,
        exp_year: params.card_ExpYear,
        cvc: params.card_CVC,
      },
    });
    const card = await stripe.customers.createSource(params.customer_Id, {
      source: `${card_token.id}`,
    });

    callback(null, { card: card.id });
  } catch (error) {
    throw error;
  }
}

export async function createCharges(params: any, callback: any) {
  try {
    const createCharge = await stripe.paymentIntents.create({
      receipt_email: params.receipt_email,
      amount: params.amount,
      currency: "eur",
      payment_method: params.card_id,
      customer: params.customer_Id,
      payment_method_types: ["card"],
    });
    callback(null, createCharge);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createCharges,
  createCustomer,
  addCard,
};
