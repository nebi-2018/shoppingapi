import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

it("returns a status of 404 if the product is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/products/${id}`).send().expect(404);
});

it("returns the product if the product is found", async () => {
  const title = "concert";
  const price = 20;
  const code = "12345";
  const image = "";

  const response = await request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({ title, price, code, image })
    .expect(201);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send()
    .expect(200);

  expect(productResponse.body.title).toEqual(title);
  expect(productResponse.body.price).toEqual(price);
  expect(productResponse.body.code).toEqual(code);
  expect(productResponse.body.image).toEqual(image);
});
