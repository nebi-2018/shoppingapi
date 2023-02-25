import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  console.log("Starting up auth2 ...");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(
      "mongodb+srv://authapi:auth@cluster0.2f6yqbj.mongodb.net",
      {}
    );
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
