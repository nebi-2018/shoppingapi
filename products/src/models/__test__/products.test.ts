import { Product } from "../products";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a product
  const product = Product.build({
    title: "concert",
    price: 4,
    code: "12345",
    image: "",
    userId: "jksdkaj",
  });
  // Save the product to the database
  await product.save();
  // Fetch the ticket twice
  const firstInstance = await Product.findById(product.id);
  const secondInstance = await Product.findById(product.id);
  // Make two separte changes to the products we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 30 });
  // Save the first fetched products
  await firstInstance!.save();
  // Save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});
