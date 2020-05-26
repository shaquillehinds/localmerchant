const Product = require("../../server/models/ProductModel");

const products = [
  {
    name: "brake pads",
    price: 9000,
    category: "car parts",
    merchant: "",
  },
  {
    name: "headphones",
    price: 5000,
    category: "audio",
    merchant: "",
  },
  {
    name: "watch",
    price: 100000,
    category: "wrist wear",
    merchant: "",
  },
  {
    name: "bath soap",
    price: 300,
    category: "skin care",
    merchant: "",
  },
];

const seedProductsDB = async (products, id) => {
  await Product.deleteMany();
  const saved = [];
  for (product of products) {
    const newProduct = new Product({ ...product, merchant: id });
    const {
      _id,
      name,
      price,
      category,
      merchant,
      __v,
    } = await newProduct.save();
    const res = {
      _id: _id.toString(),
      name,
      price,
      category,
      merchant: merchant.toString(),
      __v,
    };
    saved.push(res);
  }
  return saved;
};
module.exports = { products, seedProductsDB };
