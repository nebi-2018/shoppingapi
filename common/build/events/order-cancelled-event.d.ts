import { Subjects } from "./subjects";
export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;
        product: {
            id: string;
        };
    };
}
