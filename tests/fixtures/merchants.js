const mongoose = require("mongoose");
const Merchant = require("../../server/models/MerchantModel");

const merchants = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "John",
    email: "john@example.com",
    password: "johnking",
    phone: 4643534,
    industry: "Automotive",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Terry",
    email: "terry@example.com",
    password: "terryking",
    phone: 4532323,
    industry: "Electronics",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Richard",
    email: "richard@example.com",
    password: "richardking",
    phone: 4542464,
    industry: "Jewelry",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Mary",
    email: "mary@example.com",
    password: "maryking",
    phone: 4867444,
    industry: "Beauty",
  },
];

const seedMerchantDB = async (merchants) => {
  await Merchant.deleteMany();
  const saved = [];
  merchants.forEach(async (merchant) => {
    const newMerchant = new Merchant(merchant);
    await newMerchant.generateAuthToken();
    const { _id, name, email, phone, industry } = await newMerchant.save();
    const res = { _id: _id.toString(), name, email, phone, industry };
    saved.push(res);
  });
  return saved;
};

module.exports = { merchants, seedMerchantDB };
