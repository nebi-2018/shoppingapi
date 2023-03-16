import { Publisher, UserCreatedEvent, Subjects } from "@washera/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
