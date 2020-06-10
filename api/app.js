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
const Dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

//configure application
const app = express();
const server = http.createServer(app);
Dotenv.config();
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

app.use("/api/graphql", authGraphQL, graphqlHTTP({ schema, graphiql: true }));
app.use("/api/store", storeRouter);
app.use("/api/product", productRouter);
app.use("/api/admin", adminRouter);
app.use("/api/customer", customerRouter);

module.exports = { app, server };
