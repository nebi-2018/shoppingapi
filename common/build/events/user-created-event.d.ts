import { Subjects } from "./subjects";
export interface UserCreatedEvent {
    subject: Subjects.UserCreated;
    data: {
        userId: string;
        fullName: string;
        email: string;
        stripeCustomerId: string;
    };
}
