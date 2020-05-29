const Product = require("../../express-api/models/ProductModel");

const products = [
  {
    name: "brake pads",
    price: 9000,
    tags: ["brakes", "brake pads", "car parts"],
    store: "",
  },
  {
    name: "headphones",
    price: 5000,
    tags: ["headphones", "speakers", "audio"],
    store: "",
  },
  {
    name: "watch",
    price: 100000,
    tags: ["watch", "jewelry", "wrist wear"],
    store: "",
  },
  {
    name: "bath soap",
    price: 300,
    tags: ["skin care", "soap", "beauty"],
    store: "",
  },
];

const seedProductsDB = async (products, id) => {
  await Product.deleteMany();
  const saved = [];
  for (product of products) {
    const newProduct = new Product({ ...product, store: id });
    const { _id, name, price, image, tags, store, inStock } = await newProduct.save();
    const res = {
      _id: _id.toString(),
      name,
      price,
      image,
      tags: Array.from(tags),
      store: store.toString(),
      inStock,
    };
    saved.push(res);
  }
  return saved;
};
module.exports = { products, seedProductsDB };
