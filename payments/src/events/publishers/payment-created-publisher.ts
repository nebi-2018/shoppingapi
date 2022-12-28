import { Subjects, Publisher, PayementCreatedEvent } from "@washera/common";

export class PaymentCreatedPublisher extends Publisher<PayementCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
