//require application core modules
const express = require("express");
const Dotenv = require("dotenv");
require("./db/mongoose");

//configure application
const app = express();
Dotenv.config();
const PORT = process.env.PORT;

//require application models
const Merchant = require("./models/MerchantModel");
const Product = require("./models/ProductModel");

//Application Routes
app.post("/merchant", (req, res) => {});

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
