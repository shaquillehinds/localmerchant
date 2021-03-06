const jwt = require("jsonwebtoken");
const Store = require("../models/StoreModel");
const Admin = require("../models/AdminModel");
const Customer = require("../models/CustomerModel");

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Please Authenticate");
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return false;
    return decoded;
  });
  if (!decoded) {
    return res.status(401).send("Please Authenticate");
  }
  const _id = decoded._id;
  const admin = await Admin.findOne({ _id, "tokens.token": token });
  if (admin) {
    req.user = admin;
    req.token = token;
    return next();
  }
  try {
    const store = await Store.findById({ _id, "tokens.token": token });
    req.user = store;
    req.token = token;
    return next();
  } catch {
    return res.status(401).send("Please Authenticate");
  }
};

const authAdmin = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send("Please Authenticate");
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return false;
      return decoded;
    });
    if (!decoded) {
      throw new Error();
    }
    const user = await Admin.findOne({ _id: decoded._id, "tokens.token": token, rank: "super admin" });
    req.user = user;
    req.token = token;
    return next();
  } catch (e) {
    return res.status(401).send("Please Authenticate");
  }
};

const authCustomer = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Please Authenticate");
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return false;
    return decoded;
  });
  if (!decoded) {
    return res.status(401).send("Please Authenticate");
  }
  const _id = decoded._id;
  const admin = await Admin.findOne({ _id, "tokens.token": token });
  if (admin) {
    req.user = admin;
    req.token = token;
    return next();
  }
  try {
    const store = await Customer.findById({ _id, "tokens.token": token });
    req.user = store;
    req.token = token;
    return next();
  } catch {
    return res.status(401).send("Please Authenticate");
  }
};

const authGraphQL = async (req, res, next) => {
  if (req.headers.authorization) {
    req.token = req.headers.authorization.replace("Bearer ", "");
    return next();
  }
  req.token = false;
  next();
};

module.exports = { auth, authCustomer, authAdmin, authGraphQL };
