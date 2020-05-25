const request = require("supertest");
const app = require("../../server/app");
const Merchant = require("../../server/models/MerchantModel");
const { seedMerchantDB, merchants } = require("../fixtures/merchants");
const { products, seedProductsDB } = require("../fixtures/products");

// clean and database before each test
beforeEach(async () => {
  await Merchant.deleteMany();
});

test("should fetch merchants correctly", async () => {
  try {
    const savedMerchants = await seedMerchantDB(merchants);
    const res = await request(app).get("/merchant").expect(200);
    expect(res.body).toEqual(savedMerchants);
  } catch (e) {
    console.log(e);
  }
});

test("should create a new merchant correctly", async () => {
  const res = await request(app)
    .post("/merchant")
    .send({
      name: "John",
      email: "john@example.com",
      password: "johnking",
      phone: 4643534,
      industry: "Automotive",
    })
    .expect(201);
  expect(res.body).toEqual({
    sid: expect.any(String),
    sname: "John",
    semail: "john@example.com",
  });
});

test("should get products of merchant", async () => {
  await seedMerchantDB(merchants);
  const id = merchants[0]._id;
  const savedProducts = await seedProductsDB(products, id);
  try {
    const res = await request(app).get(`/merchant/${id}/products`).expect(200);
    expect(res.body).toEqual(savedProducts);
  } catch (e) {
    console.log(e);
  }
});
