import Stripe from "stripe";
import { stripe } from "./stripe";
import { Request, Response, NextFunction } from "express";

const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
    });
    res.status(200).send(customer);
  } catch (error) {
    throw error;
  }
};

const addCard = async (req: Request, res: Response, next: NextFunction) => {
  const {
    customer_Id,
    card_Name,
    card_ExpYear,
    card_ExpMonth,
    card_Number,
    card_CVC,
  } = req.body;
  try {
    const card_token = await stripe.tokens.create({
      card: {
        name: card_Name,
        number: card_Number,
        exp_month: card_ExpMonth,
        exp_year: card_ExpYear,
        cvc: card_CVC,
      },
    });
    const card = await stripe.customers.createSource(customer_Id, {
      source: `${card_token.id}`,
    });
    return res.status(200).send({ card: card.id });
  } catch (error) {
    throw error;
  }
};

const createCharges = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createCharge = await stripe.paymentIntents.create({
      receipt_email: req.body.receipt_email,
      amount: req.body.amount,
      currency: "eur",
      payment_method: req.body.card_id,
      customer: req.body.customer_Id,
      payment_method_types: ["card"],
    });
    res.send(createCharge);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createCharges,
  createCustomer,
  addCard,
};
