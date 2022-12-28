import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  try {
    process.env.JWT_KEY = "asdfasdf";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
  } catch (err) {
    console.log(err);
  }
});

beforeEach(async () => {
  try {
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

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
