import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Product } from "../../models/products";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  try {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/products/${id}`)
      .set("Cookie", global.signin())
      .send({
        title: "aslkdfj",
        price: 20,
        code: "12345",
        image: "",
      })
      .expect(404);
  } catch (err) {
    console.log(err);
  }
});

it("returns a 401 if the user is not authenticated", async () => {
  try {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/products/${id}`)
      .send({
        title: "aslkdfj",
        price: 20,
        code: "12345",
        image: "",
      })
      .expect(401);
  } catch (err) {
    console.log(err);
  }
});

it("returns a 401 if the user does not own the product", async () => {
  try {
    const response = await request(app)
      .post("/api/products")
      .set("Cookie", global.signin())
      .send({
        title: "asldkfj",
        price: 20,
        code: "12345",
        image: "",
      });

    await request(app)
      .put(`/api/products/${response.body.id}`)
      .set("Cookie", global.signin())
      .send({
        title: "alskdjflskjdf",
        price: 1000,
        code: "12345",
        image: "",
      })
      .expect(401);
  } catch (err) {
    console.log(err);
  }
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  try {
    const cookie = global.signin();

    const response = await request(app)
      .post("/api/products")
      .set("Cookie", cookie)
      .send({
        title: "asldkfj",
        price: 20,
        code: "12345",
        image: "",
      });

    await request(app)
      .put(`/api/products/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "",
        price: 20,
        code: "12345",
        image: "",
      })
      .expect(400);

    await request(app)
      .put(`/api/products/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "alskdfjj",
        price: -10,
        code: "12345",
        image: "",
      })
      .expect(400);
  } catch (err) {
    console.log(err);
  }
});

it("updates the product provided valid inputs", async () => {
  try {
    const cookie = global.signin();

    const response = await request(app)
      .post("/api/products")
      .set("Cookie", cookie)
      .send({
        title: "asldkfj",
        price: 20,
        code: "12345",
        image: "",
      });

    await request(app)
      .put(`/api/products/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "new title",
        price: 100,
        code: "12345",
        image: "",
      })
      .expect(200);

    const productResponse = await request(app)
      .get(`/api/products/${response.body.id}`)
      .send();

    expect(productResponse.body.title).toEqual("new title");
    expect(productResponse.body.price).toEqual(100);
  } catch (err) {
    console.log(err);
  }
});

it("publishes an event", async () => {
  try {
    const cookie = global.signin();

    const response = await request(app)
      .post("/api/products")
      .set("Cookie", cookie)
      .send({
        title: "asldkfj",
        price: 20,
        code: "12345",
        image: "",
      });

    await request(app)
      .put(`/api/products/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "new title",
        price: 100,
        code: "12345",
        image: "",
      })
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  } catch (err) {
    console.log(err);
  }
});

it("rejects updates if the product is reserved", async () => {
  try {
    const cookie = global.signin();

    const response = await request(app)
      .post("/api/products")
      .set("Cookie", cookie)
      .send({
        title: "asldkfj",
        price: 20,
        code: "12345",
        image: "",
      });

    const product = await Product.findById(response.body.id);
    product!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await product!.save();

    await request(app)
      .put(`/api/products/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "new title",
        price: 100,
        code: "12345",
        image: "",
      })
      .expect(400);
  } catch (err) {
    console.log(err);
  }
});
