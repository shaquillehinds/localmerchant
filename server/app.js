//require application core modules
const express = require("express");
const merchantRouter = require("./routers/merchantRoute");
const productRouter = require("./routers/productRoute");
const Dotenv = require("dotenv");
const multer = require("multer");
const cors = require("cors");

//configure applicatio
const app = express();
Dotenv.config();
require("./db/mongoose");
const upload = multer();

//require mongoose and models

const Customer = require("./models/CustomerModel");
const Admin = require("./models/AdminModel");

//middleware
app.use(cors());
app.use(express.json());
app.use("/merchant", merchantRouter);
app.use("/product", productRouter);

//create a new customer
app.post("/customer", upload.array(), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const customer = new Customer({ name, email, password });
    const saved = await customer.save();
    res.status(201).send(saved);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/admin", upload.array(), async (req, res) => {
  const { email, password } = req.body;
  const token = await Admin.findAndLogin(email, password);
  if (token instanceof Error) {
    return res.status(400).send("Unable to login.");
  }
  res.send(token);
});

// const { name, email, password } = req.body;
// const newAdmin = new Admin({ name, email, password });
// const token = await newAdmin.generateAuthToken(newAdmin._id);
// const response = await newAdmin.save();
// res.send({ ...response, token });

module.exports = app;
