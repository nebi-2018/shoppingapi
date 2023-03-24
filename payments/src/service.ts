import { OrderStatus } from "./../../common/src/events/types/order-status";
import * as stripeService from "./stripee";
import { User } from "./models/user";
import { Order } from "./models/order";
import { Card } from "./models/card";

export async function createOrder(params: any, callback: any) {
  User.findOne(
    { _id: params.params.userId },
    async function (err: any, userDB: any) {
      if (err) {
        return callback(err);
      } else {
        var model: any = {};
        if (!userDB.stripeCustomerId) {
          await stripeService.createCustomer(
            {
              name: userDB.fullName,
              email: userDB.email,
            },
            (err: any, result: any) => {
              if (err) {
                return callback(err);
              }
              if (result) {
                userDB.stripeCustomerId = result.id;
                userDB.save();

                model.stripeCustomerId = result.id;
              }
            }
          );
        } else {
          model.stripeCustomerId = userDB.stripeCustomerId;
        }
        Card.findOne(
          {
            customerId: model.stripeCustomerId,
            cardNumber: params.cardNumber,
            cardEXPMonth: params.cardEXPMonth,
            cardExpYear: params.cardExpYear,
          },
          async function (error: any, cardDB: any) {
            if (error) {
              callback(error);
            } else {
              if (!cardDB) {
                await stripeService.addCard(
                  {
                    card_Name: params.card_Name,
                    card_Number: params.card_Number,
                    card_ExpMonth: params.card_ExpMonth,
                    card_ExpYear: params.card_ExpYear,
                    card_CVC: params.card_CVC,
                    customer_id: model.stripeCustomerId,
                  },
                  (err: any, results: any) => {
                    if (err) {
                      return callback(err);
                    }
                    if (results) {
                      const cardModel = new Card({
                        cardId: results.card,
                        cardName: params.card_Name,
                        cardNumber: params.card_Number,
                        cardEXPMonth: params.card_ExpMonth,
                        cardExpYear: params.card_ExpYear,
                        cardCVC: params.card_CVC,
                        customerId: model.stripeCustomerId,
                      });
                      cardModel.save();
                      model.cardId = results.card;
                    }
                  }
                );
              } else {
                model.cardId = cardDB.cardId;
              }
              await stripeService.createCharges(
                {
                  receipt_email: userDB.email,
                  amount: params.amount,
                  card_id: model.cardId,
                  customer_id: model.stripeCustomerId,
                },
                (error: any, results: any) => {
                  if (error) {
                    return callback(error);
                  }
                  if (results) {
                    model.paymentIntentId = results.id;
                    model.client_secret = results.client_secret;
                  }
                }
              );

              // const order = Order.findById(params.orderId);

              // const orderModel = new Order({
              //   userId: order.userId,
              //   orderStatus: OrderStatus.AwaitingPayment,
              //   amount: order.amount,
              // });
            }
          }
        );
      }
    }
  );
}
