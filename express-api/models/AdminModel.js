const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAuthToken } = require("./methods&statics/methods");
const { findAndLogin } = require("./methods&statics/statics");
const { hashPassword } = require("./middleware/middleware");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
  },
  rank: {
    type: String,
    default: "admin",
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//hash password before saving if modified or new
AdminSchema.pre("save", hashPassword);

//configures the JSON response to only send certain fields
AdminSchema.methods.toJSON = function () {
  const { name } = this;
  return { name };
};

//Creates and saves a new JSONWebToken from Admin id and returns said token
AdminSchema.methods.generateAuthToken = generateAuthToken;

//Search and login user
AdminSchema.statics.findAndLogin = findAndLogin;

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
