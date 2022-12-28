import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper.ts");

process.env.STRIP_KEY = "sk_test_hnfrAm8rOkryFEnV23jjfFlw";

let mongo: any;
beforeAll(async () => {
  try {
    process.env.JWT_KEY = "asdfasdf";

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
  } catch (err) {
    console.log(err);
  }
});

beforeEach(async () => {
  try {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  try {
    if (mongo) {
      await mongo.stop();
    }
    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
});

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  //Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object.{jwt:MY_JWT}
  const session = { jwt: token };

  //Turn the session into json
  const sessionJson = JSON.stringify(session);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJson).toString("base64");

  // return a string that has the string with the encoded data
  return [`session=${base64}`];
};
