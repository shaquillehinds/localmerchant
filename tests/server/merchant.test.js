const request = require("supertest");
const app = require("../../server/app");
const Merchant = require("../../server/models/MerchantModel");
const merchants = require("../fixtures/merchants");

const saveNewMerchant = async (merchant) => {
  const newMerchant = new Merchant(merchant);
  await newMerchant.save();
};

// clean and seed database before each test
beforeEach(async () => {
  await Merchant.deleteMany();
  merchants.forEach((merchant) => saveNewMerchant(merchant));
});

test("should get products of merchant", async () => {
  const id = merchants[0]._id;
  try {
    const products = await request(app).get(`/merchant/${id}/products`).expect(200);
    console.log(products.body);
    expect(products.body).toEqual(expect.any(Array));
  } catch (e) {
    console.log(e);
  }
});
