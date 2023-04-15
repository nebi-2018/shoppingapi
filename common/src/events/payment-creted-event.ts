import { Subjects } from "./subjects";

export interface PayementCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    orderId: string;
  };
}
