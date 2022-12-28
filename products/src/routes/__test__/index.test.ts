import request from "supertest";
import { app } from "../../app";

const createProduct1 = () => {
  return request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({
      title: "cdkjk",
      price: 10,
      code: "12345",
      image: "",
    });
};

const createProduct2 = () => {
  return request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({
      title: "cdkjk",
      price: 10,
      code: "123456",
      image: "",
    });
};

const createProduct3 = () => {
  return request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({
      title: "cdkjk",
      price: 10,
      code: "123457",
      image: "",
    });
};

it("can fetch a list of products", async () => {
  await createProduct1();
  await createProduct2();
  await createProduct3();

  const response = await request(app).get("/api/products").send().expect(200);

  expect(response.body.length).toEqual(3);
});
