const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAuthToken } = require("./methods&statics/methods");
const { findPartial } = require("./methods&statics/statics");
const { hashPassword } = require("./middleware/middleware");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const MerchantSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  businessName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  coord: {
    lat: {
      type: Number,
      trim: true,
    },
    long: {
      type: Number,
      trim: true,
    },
  },
  phone: {
    type: Number,
    required: true,
  },
  industry: {
    type: String,
    required: true,
    trim: true,
  },
  rank: {
    type: String,
    default: "Bronze",
    trim: true,
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

MerchantSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "merchant",
});

//hash password before saving if modified or new
MerchantSchema.pre("save", hashPassword);

//
MerchantSchema.statics.findPartial = findPartial;

//configures the JSON response to only send certain fields
MerchantSchema.methods.toJSON = function () {
  const { _id, firstName, lastName, businessName, email, phone, industry, address, coord } = this;
  return { _id, firstName, lastName, businessName, email, phone, industry, address, coord };
};

//Creates and saves a new JSONWebToken from merchant id and returns said token
MerchantSchema.methods.generateAuthToken = generateAuthToken;

const Merchant = mongoose.model("Merchant", MerchantSchema);

module.exports = Merchant;
