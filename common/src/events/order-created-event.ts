import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

// export interface OrderCreatedEvent {
//   subject: Subjects.OrderCreated;
//   data: {
//     id: string;
//     status: OrderStatus;
//     userId: string;
//     product: {
//       id: string;
//       price: number;
//     };
//   };
// }

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    product: {
      id: string;
    }[];
    amount: number;
  };
}
