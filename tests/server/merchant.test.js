const app = require("../../server/app");
const request = require("supertest");
const Merchant = require("../../server/models/MerchantModel");
const merchants = require("../fixtures/merchants");

const saveNewMerchant = async (merchant) => {
  const newMerchant = new Merchant(merchant);
  const saved = await newMerchant.save();
};

//clean and seed database before each test
beforeEach(async () => {
  Merchant.deleteMany();
  merchants.forEach((merchant) => saveNewMerchant(merchant));
});

// test("should get products of merchant", async (req, res) => {
//   const id = merchants[0]._id;
//   const products = await request(app.get(`/merchants/${id}/products`).expect(200));
//   expect(products).toBe(expect.any(Array));
// });
