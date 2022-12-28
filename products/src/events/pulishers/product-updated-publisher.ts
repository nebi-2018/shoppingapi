import { Publisher, Subjects, ProductUpdatedEvent } from "@washera/common";

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
