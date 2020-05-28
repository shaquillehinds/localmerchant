const request = require("supertest");
const app = require("../../server/app");
const { seedMerchantDB, merchants } = require("../fixtures/merchants");
const { seedProductsDB, products } = require("../fixtures/products");

let savedMerchants;

// clean and database before each test
beforeEach(async () => {
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
      address: "87 Wanstead, St.Michael",
      industry: "Automotive",
    })
    .expect(201);
  expect(res.body).toEqual({
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
  const id = savedMerchants[0]._id;
  const saved = await seedProductsDB(products, id);
  try {
    const res = await request(app).get(`/merchant/${merchants[0].name}/products`).expect(200);
    expect(res.body).toEqual(saved);
  } catch (e) {
    console.log(e);
  }
});
