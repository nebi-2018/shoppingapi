import request from "supertest";
import { Product } from "../../models/products";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/product for post requests", async () => {
  try {
    const response = await request(app).post("/api/products").send({});

    expect(response.status).not.toEqual(404);
  } catch (err) {
    console.log(err);
  }
});

it("can only be accessed if the user is signed in", async () => {
  try {
    await request(app).post("/api/products").send({}).expect(401);
  } catch (err) {
    console.log(err);
  }
});

it("returns a status other than 401 if the user is signed in", async () => {
  try {
    const response = await request(app)
      .post("/api/products")
      .set("Cookie", global.signin())
      .send({});

    expect(response.status).not.toEqual(401);
  } catch (err) {
    console.log(err);
  }
});

it("returns an error if an invalid title is provided", async () => {
  try {
    await request(app)
      .post("/api/products")
      .set("Cookie", global.signin())
      .send({
        title: "",
        price: 10,
        code: "12345",
        image: "",
      })
      .expect(400);

    await request(app)
      .post("/api/products")
      .set("Cookie", global.signin())
      .send({
        price: 10,
        code: "12345",
        image: "",
      })
      .expect(400);
  } catch (err) {
    console.log(err);
  }
});

it("returns an error if an invalid price is provided", async () => {
  try {
    await request(app)
      .post("/api/products")
      .set("Cookie", global.signin())
      .send({
        title: "dbkjabjk",
        price: -10,
        code: "12345",
        image: "",
      })
      .expect(400);

    await request(app)
      .post("/api/products")
      .set("Cookie", global.signin())
      .send({
        title: "nsddab",
        code: "12345",
        image: "",
      })
      .expect(400);
  } catch (err) {
    console.log(err);
  }
});

it("creates products with a valid inputs", async () => {
  try {
    let products = await Product.find({});
    expect(products.length).toEqual(0);

    await request(app)
      .post("/api/products")
      .set("Cookie", global.signin())
      .send({
        title: "dbkjabjk",
        price: 10,
        code: "12345",
        image: "",
      })
      .expect(201);

    products = await Product.find({});
    expect(products.length).toEqual(1);
    expect(products[0].price).toEqual(10);
  } catch (err) {
    console.log(err);
  }
});

it("publishes an event", async () => {
  try {
    await request(app)
      .post("/api/products")
      .set("Cookie", global.signin())
      .send({
        title: "dbkjabjk",
        price: 10,
        code: "12345",
        image: "",
      })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  } catch (err) {
    console.log(err);
  }
});
