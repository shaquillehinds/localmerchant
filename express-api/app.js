//require application core modules
const express = require("express");
const storeRouter = require("./routers/storeRoute");
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
app.use("/api/store", storeRouter);
app.use("/api/product", productRouter);
app.use("/api/admin", adminRouter);
app.use("/api/customer", customerRouter);

module.exports = app;
