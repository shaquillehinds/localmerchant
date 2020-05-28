//require application core modules
const express = require("express");
const merchantRouter = require("./routers/merchantRoute");
const productRouter = require("./routers/productRoute");
const adminRouter = require("./routers/adminRoute");
const customerRouter = require("./routers/customerRoute");
const Dotenv = require("dotenv");
const cors = require("cors");

//configure application
const app = express();
Dotenv.config();
const connect = require("./db/mongoose");
connect();

//middleware
app.use(cors());
app.use(express.json());
app.use("/merchant", merchantRouter);
app.use("/product", productRouter);
app.use("/admin", adminRouter);
app.use("/customer", customerRouter);

module.exports = app;
