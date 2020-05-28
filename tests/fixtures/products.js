const Product = require("../../server/models/ProductModel");

const products = [
  {
    name: "brake pads",
    price: 9000,
    tags: ["brakes", "brake pads", "car parts"],
    merchant: "",
  },
  {
    name: "headphones",
    price: 5000,
    tags: ["headphones", "speakers", "audio"],
    merchant: "",
  },
  {
    name: "watch",
    price: 100000,
    tags: ["watch", "jewelry", "wrist wear"],
    merchant: "",
  },
  {
    name: "bath soap",
    price: 300,
    tags: ["skin care", "soap", "beauty"],
    merchant: "",
  },
];

const seedProductsDB = async (products, id) => {
  await Product.deleteMany();
  const saved = [];
  for (product of products) {
    const newProduct = new Product({ ...product, merchant: id });
    const { _id, name, price, tags, merchant, inStock } = await newProduct.save();
    const res = {
      _id: _id.toString(),
      name,
      price,
      tags: Array.from(tags),
      merchant: merchant.toString(),
      inStock,
    };
    saved.push(res);
  }
  return saved;
};
module.exports = { products, seedProductsDB };
