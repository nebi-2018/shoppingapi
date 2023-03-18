import { Subjects } from "./subjects";

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
  data: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    stripeCustomerId: string;
  };
}
