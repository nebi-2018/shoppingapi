// import express, { Request, Response } from "express";
// import {
//   NotAuthorizedError,
//   NotFoundError,
//   requireAuth,
// } from "@washera/common";
// import { Order } from "../models/order";

// const router = express.Router();

// router.put(
//   "/api/orders/:orderId",
//   requireAuth,
//   async (req: Request, res: Response) => {
//     const order = await Order.findById(req.params.orderId);

//     if (!order) {
//       throw new NotFoundError();
//     }
//     if (order.userId !== req.currentUser!.id) {
//       throw new NotAuthorizedError();
//     }

//     var model = {
//       orderStaus: req.params.status,
//       transactionId: req.params.transactionId,
//     };

//     Order.findByIdAndUpdate(req.params.orderId, model, {
//       useFindAndModify: false,
//     })
//       .then((response) => {
//         if (!response) {
//           throw new NotFoundError();
//         } else {
//           if (req.params.status === "success") {
//           }
//           return response;
//         }
//       })
//       .catch((error) => {
//         throw error;
//       });

//     res.send({ message: "Success", data: order });
//   }
// );

// export { router as updateChargeRouter };
