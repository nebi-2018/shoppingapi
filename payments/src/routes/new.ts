import { natsWrapper } from "../nats-wrapper";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  BadRequestError,
  validateRequest,
  NotFoundError,
  OrderStatus,
  NotAuthorizedError,
} from "@washera/common";
import { Order } from "../models/order";
import { User } from "../models/user";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Card } from "../models/card";

const braintree = require("braintree");

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    //body("token").not().isEmpty(),
    body("orderId").not().isEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      orderId,
      card_Name,
      card_ExpYear,
      card_ExpMonth,
      card_Number,
      card_CVC,
    } = req.body;

    const order = await Order.findById(orderId);
    console.log(order);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const bpk = new braintree(process.env.PUBLIC_KEY);
    const bpv = new braintree(process.env.PRIVATE_KEY);
    const bmi = new braintree(process.env.MERCHANT_ID);

    const nonceFromTheClient = req.body.payment_method_nonce;
    const deviceData = req.body.device_Data;

    var gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: bpk,
      publicKey: bpv,
      privateKey: bmi,
    });

    const chala = gateway.transaction.sale(
      {
        amount: order.amount,
        paymentMethodNonce: nonceFromTheClient,
        deviceData: deviceData,
        options: {
          submitForSettlement: true,
        },
      },
      (err: any, result: any) => {
        if (err) {
          console.error(err);
          return;
        }

        if (result.success) {
          console.log("Transaction ID: " + result.transaction.id);
        } else {
          console.error(result.message);
        }
        return result.transaction.id;
      }
    );

    //for test
    // const user = await User.findOne({ userId: order.userId });
    // console.log(`I found the user ${user}`);

    // if (!user) {
    //   throw new NotFoundError();
    // }

    // var model: any = {};

    // if (!user.stripeCustomerId) {
    //   const customer = await stripe.customers.create({
    //     name: user.fullName,
    //     email: user.email,
    //   });

    //   user.stripeCustomerId = customer.id;
    //   user.save();

    //   model.stripeCustomerId = customer.id;
    // } else {
    //   model.stripeCustomerId = user.stripeCustomerId;
    // }

    // Card.findOne(
    //   {
    //     customerId: model.stripeCustomerId,
    //     cardNumber: card_Number,
    //     cardEXPMonth: card_ExpMonth,
    //     cardExpYear: card_ExpYear,
    //   },
    //   async function (err: any, cardDB: any) {
    //     if (err) {
    //       return console.log(err);
    //     } else {
    //       if (!cardDB) {
    //         const card_token = await stripe.tokens.create({
    //           card: {
    //             name: card_Name,
    //             number: card_Number,
    //             exp_month: card_ExpMonth,
    //             exp_year: card_ExpYear,
    //             cvc: card_CVC,
    //           },
    //         });
    //         const card = await stripe.customers.createSource(
    //           model.stripeCustomerId,
    //           {
    //             source: `${card_token.id}`,
    //           }
    //         );

    //         const cardD = Card.build({
    //           cardId: card.id,
    //           cardName: card_Name,
    //           cardNumber: card_Number,
    //           cardEXPMonth: card_ExpMonth,
    //           cardEXPYear: card_ExpYear,
    //           cardCVC: card_CVC,
    //           customerId: model.stripeCustomerId,
    //         });

    //         cardD.save();
    //         model.cardId = card.id;
    //       } else {
    //         model.cardId = cardDB.cardId;
    //       }
    //     }
    //   }
    // );

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Can not pay for a cancelled order");
    }

    // const charge = await stripe.charges.create({
    //   receipt_email: "snoopafr@gmail.com",
    //   currency: "eur",
    //   amount: order.amount * 100,
    //   //source: token,
    //   customer: customer.id,
    // });

    // const charge = await stripe.paymentIntents.create({
    //   receipt_email: "nebiw@metropolia.fi",
    //   amount: order.amount * 100,
    //   currency: "eur",
    //   payment_method: model.cardId,
    //   //customer: user.stripeCustomerId,
    //   customer: model.stripeCustomerId,
    //   payment_method_types: ["card"],
    // });

    // model.paymentIntentId = charge.id;
    // model.client_secret = charge.client_secret;

    // async function updateOrder(params: any, callBack: any) {
    //   var model = {
    //     orderStaus: params.status,
    //     transactionId: params.transactionId,
    //   };

    //   Order.findByIdAndUpdate(params.orderId, model, {
    //     useFindAndModify: false,
    //   })
    //     .then((response) => {
    //       if (!response) {
    //         callBack("Order Update failed");
    //       } else {
    //         if (params.status === "success") {
    //         }
    //         return callBack(null, response);
    //       }
    //     })
    //     .catch((error) => {
    //       return callBack(error);
    //     });
    // }

    // var model = {
    //   userId: req.currentUser?.id,
    //   card_Number: req.body.card_Number,
    //   card_ExpMonth: req.body.card_ExpMonth,
    //   card_ExpYear: req.body.card_ExpYear,
    //   card_CVC: req.body.card_CVC,
    //   amount: order.amount,
    // };

    // orderService.createOrder(model, (error: any, results: any) => {
    //   if (error) {
    //     throw new BadRequestError("there is some problem");
    //   }
    //   return res.status(200).send({ message: "Success", data: results });
    // });

    //this was the original charge object
    // const charge = await stripe.charges.create({
    //   currency: "eur",
    //   amount: order.amount * 100,
    //   source: token,
    // });

    // const charge = await stripe.paymentIntents.create({
    //   currency: "eur",
    //   amount: order.amount * 100,
    //   //source: token,
    //   confirm: true,
    // });

    const payment = Payment.build({
      orderId,
      transactionId: chala,
      // stripeId: charge.id,
      // paymentIntentId: charge.id,
      // clientsecret: charge.client_secret,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      transactionId: payment.transactionId,
    });

    res.status(201).send(payment);
  }
);

export { router as createChargeRouter };
