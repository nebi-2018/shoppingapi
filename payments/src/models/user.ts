import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  userId: string;
  fullName: string;
  email: string;
  stripeCustomerId: string;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  userId: string;
  fullName: string;
  email: string;
  stripeCustomerId: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },

    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
