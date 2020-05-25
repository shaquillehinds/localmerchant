//require application core modules
const express = require("express");
const Dotenv = require("dotenv");
const multer = require("multer");

//configure application
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const upload = multer();
Dotenv.config();

//require mongoose and models
require("./db/mongoose");
const Customer = require("./models/CustomerModel");
const Product = require("./models/ProductModel");
const Merchant = require("./models/MerchantModel");

/*************************App Routes ****************************/

//get merchant products
app.get("/merchant/:id/products", async (req, res) => {
  const id = req.params.id;
  try {
    const merchant = await Merchant.findById(id).populate("products").exec();
    res.send(merchant.products);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//create a new merchant
app.post("/merchant", upload.array(), async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, phone, industry } = req.body;
    const merchant = new Merchant({ name, email, password, phone, industry });
    const saved = await merchant.save();
    res.status(201).send(saved);
  } catch (e) {
    res.status(500).send(e);
  }
});

//create a new customer
app.post("/customer", upload.array(), async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password } = req.body;
    const customer = new Customer({ name, email, password });
    const saved = await customer.save();
    res.status(201).send(saved);
  } catch (e) {
    res.status(500).send(e);
  }
});

//create a new product
app.post("/product", upload.array(), async (req, res) => {
  try {
    const { name, price, category, merchant } = req.body;
    const product = new Product({ name, price, category, merchant });
    const saved = await product.save();
    res.status(201).send(saved);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = app;
