import { Subjects } from "./subjects";
export interface UserCreatedEvent {
    subject: Subjects.UserCreated;
    data: {
        fullName: string;
        email: string;
        stripeCustomerId: string;
    };
}
