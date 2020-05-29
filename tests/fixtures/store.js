const mongoose = require("mongoose");
const Store = require("../../express-api/models/StoreModel");

const stores = [
  {
    _id: new mongoose.Types.ObjectId(),
    firstName: "John",
    lastName: "King",
    businessName: "Real Parts",
    businessURL: "realparts",
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
    firstName: "Terry",
    lastName: "King",
    businessName: "Super Electronics",
    businessURL: "superelectronics",
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
    firstName: "Richard",
    lastName: "King",
    businessName: "Crown Jewels",
    businessURL: "crownjewels",
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
    firstName: "Mary",
    lastName: "King",
    businessName: "Natural Beauty",
    businessURL: "naturalbeauty",
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

const seedStoreDB = async () => {
  const saved = [];
  try {
    await Store.deleteMany();
    for (store of stores) {
      const newStore = new Store(store);
      const token = await newStore.generateAuthToken();
      const {
        _id,
        firstName,
        lastName,
        businessName,
        businessURL,
        email,
        phone,
        industry,
        address,
        coord,
      } = await newStore.save();
      const res = {
        _id: _id.toString(),
        firstName,
        lastName,
        businessName,
        businessURL,
        email,
        phone,
        industry,
        address,
        coord,
      };
      saved.push(res);
    }
  } catch (e) {
    console.log(e);
  }
  return saved;
};

module.exports = { stores, seedStoreDB };
