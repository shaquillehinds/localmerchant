//require application core modules
const express = require("express");
const http = require("http");
const schema = require("./graphql/schema");
const graphqlHTTP = require("express-graphql");
const { authGraphQL } = require("./middleware/auth");
const storeRouter = require("./routers/storeRoute");
const productRouter = require("./routers/productRoute");
const adminRouter = require("./routers/adminRoute");
const customerRouter = require("./routers/customerRoute");
const paymentRouter = require("./routers/paymentRoute");
const Dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

//configure application
const app = express();
const server = http.createServer(app);
if (process.env.NODE_ENV !== "production") {
  Dotenv.config();
}
const connect = require("./db/mongoose");
const connection = connect();
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: "session",
});

//middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 60000 * 60 * 24 * 7,
    },
  })
);
app.use(cookieParser(process.env.JWT_SECRET));
app.use("/api/graphql", authGraphQL, graphqlHTTP({ schema, graphiql: true }));
app.use("/api/store", storeRouter);
app.use("/api/product", productRouter);
app.use("/api/admin", adminRouter);
app.use("/api/customer", customerRouter);
app.use("/api/payment", paymentRouter);
app.use((req, res, next) => {
  if (req.session.token) {
    res.cookie("loggedIn", "yes");
  } else {
    res.cookie("loggedIn", "no");
  }
  if (req.session.customer) {
    res.cookie("customer", "yes");
  } else {
    res.cookie("customer", "no");
  }
  next();
});

module.exports = { app, server };
