const mongoose = require("mongoose");
const Merchant = require("../../server/models/MerchantModel");

const merchants = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "John",
    email: "john@example.com",
    password: "johnking",
    phone: 4643534,
    address: "87 Wanstead, St.Michael",
    coord: {
      lat: 13.218575,
      long: -59.635004,
    },
    industry: "Automotive",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Terry",
    email: "terry@example.com",
    password: "terryking",
    phone: 4532323,
    address: "87 Wanstead, St.Michael",
    coord: {
      lat: 13.218575,
      long: -59.635004,
    },
    industry: "Electronics",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Richard",
    email: "richard@example.com",
    password: "richardking",
    phone: 4542464,
    address: "87 Wanstead, St.Michael",
    coord: {
      lat: 13.218575,
      long: -59.635004,
    },
    industry: "Jewelry",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Mary",
    email: "mary@example.com",
    password: "maryking",
    phone: 4867444,
    address: "87 Wanstead, St.Michael",
    coord: {
      lat: 13.218575,
      long: -59.635004,
    },
    industry: "Beauty",
  },
];

const seedMerchantDB = async () => {
  const saved = [];
  try {
    await Merchant.deleteMany();
    for (merchant of merchants) {
      const newMerchant = new Merchant(merchant);
      const token = await newMerchant.generateAuthToken();
      const { _id, name, email, phone, industry, address, coord } = await newMerchant.save();
      const res = { _id: _id.toString(), name, email, phone, industry, address, coord };
      saved.push(res);
    }
  } catch (e) {
    console.log(e);
  }
  return saved;
};

module.exports = { merchants, seedMerchantDB };
