const request = require("supertest");
const app = require("../../server/app");
const Merchant = require("../../server/models/MerchantModel");
const { seedMerchantDB, merchants } = require("../fixtures/merchants");
const { products, seedProductsDB } = require("../fixtures/products");

let savedMerchants;

// clean and database before each test
beforeEach(async () => {
  await Merchant.deleteMany();
  savedMerchants = await seedMerchantDB(merchants);
});

test("should create a new merchant correctly", async () => {
  const res = await request(app)
    .post("/merchant")
    .send({
      name: "Lisa",
      email: "lisa@example.com",
      password: "lisaking",
      phone: 4643534,
      industry: "Automotive",
    })
    .expect(201);
  expect(res.body).toEqual({
    id: expect.any(String),
    name: "Lisa",
    email: "lisa@example.com",
    token: expect.any(String),
  });
});

test("should fetch merchants correctly", async () => {
  try {
    const res = await request(app).get("/merchant").expect(200);
    expect(res.body).toEqual(savedMerchants);
  } catch (e) {
    console.log(e);
  }
});

test("should get products of merchant", async () => {
  const id = merchants[0]._id;
  const savedProducts = await seedProductsDB(products, id);
  try {
    const res = await request(app)
      .get(`/merchant/${merchants[0].name}/products`)
      .expect(200);
    expect(res.body).toEqual(savedProducts);
  } catch (e) {
    console.log(e);
  }
});
