import { Subjects } from "./subjects";

export interface ProductUpdatedEvent {
  subject: Subjects.ProductUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    code: string;
    image: string;
    userId: string;
    orderId?: string;
  };
}
