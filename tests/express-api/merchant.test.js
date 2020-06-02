const request = require("supertest");
const app = require("../../api/app");
const { seedStoreDB, stores } = require("../fixtures/store");
const { seedProductsDB, products } = require("../fixtures/products");

let savedStores;

// clean and database before each test
beforeEach(async () => {
  savedStores = await seedStoreDB(stores);
});

test("should fetch stores correctly", async () => {
  try {
    const res = await request(app).get("/api/store").expect(200);
    expect(res.body).toEqual(savedStores);
  } catch (e) {
    console.log(e);
  }
});

test("should get products of store", async () => {
  const id = savedStores[0]._id;
  try {
    const saved = await seedProductsDB(products, id);
    const res = await request(app).get(`/api/store/${savedStores[0].businessURL}/products`).expect(200);
    expect(res.body).toEqual(saved);
  } catch (e) {
    console.log(e);
  }
});

test("should create a new store correctly", (done) => {
  try {
    request(app)
      .post("/api/store")
      .send({
        firstName: "Lisa",
        lastName: "King",
        businessName: "Speed and Control",
        email: "lisa@example.com",
        password: "lisaking",
        phone: 4643534,
        address: "87 Wanstead, St.Michael",
        industry: "Automotive",
      })
      .expect(201)
      .end((err, res) => {
        console.log(res.error);
        expect(res.body).toEqual({
          token: expect.any(String),
        });
        done();
      });
  } catch (e) {
    console.log(e);
  }
});
