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
const Merchant = require("./models/MerchantModel");
const Customer = require("./models/CustomerModel");
const Product = require("./models/ProductModel");

//Application Routes
app.post("/merchant", upload.array(), async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, phone } = req.body;
    const merchant = new Merchant({ name, email, password, phone });
    const saved = await merchant.save();
    res.status(201).send(saved);
  } catch (e) {
    res.status(500).send(e);
  }
});

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

module.exports = app;
