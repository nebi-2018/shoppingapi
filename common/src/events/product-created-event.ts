import { Subjects } from "./subjects";

export interface ProductCreatedEvent {
  subject: Subjects.ProductCreated;
  data: {
    id: string;
    title: string;
    price: number;
    code: string;
    image: string;
    userId: string;
  };
}
