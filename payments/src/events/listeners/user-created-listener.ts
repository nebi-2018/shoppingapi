import { Listener, UserCreatedEvent, Subjects } from "@washera/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent["data"], msg: Message) {
    const user = User.build({
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      stripeCustomerId: data.stripeCustomerId,
    });

    console.log(`this is from user-created-listener ${user.id}`);

    await user.save();

    msg.ack();
  }
}
