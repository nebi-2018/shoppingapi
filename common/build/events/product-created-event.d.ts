import { Subjects } from "./subjects";
export interface ProductCreatedEvent {
    subject: Subjects.ProductCreated;
    data: {
        id: string;
        products: [];
        title: string;
        price: number;
        code: string;
        image: string;
        userId: string;
    };
}
