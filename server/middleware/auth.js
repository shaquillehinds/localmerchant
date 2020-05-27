const jwt = require("jsonwebtoken");
const Merchant = require("../models/MerchantModel");
const Admin = require("../models/AdminModel");

const authorize = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).send("Please Authenticate");
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(400).send("Please Authenticate");
  }
  const _id = decoded._id;
  const admin = await Admin.findOne({ _id, "tokens.token": token });
  if (admin) {
    req.user = admin;
    req.token = token;
    return next();
  }
  try {
    const merchant = await Merchant.findById({ _id, "tokens.token": token });
    req.user = merchant;
    req.token = token;
    return next();
  } catch {
    res.status(400).send("Please Authenticate");
  }
};

module.exports = authorize;
