import { Publisher, Subjects, ProductCreatedEvent } from "@washera/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
