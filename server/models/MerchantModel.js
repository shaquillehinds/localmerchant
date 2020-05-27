const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAuthToken } = require("./methods&statics/methods");
const { findPartial } = require("./methods&statics/statics");
const { hashPassword } = require("./middleware/middleware");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const MerchantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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
  phone: {
    type: Number,
    required: true,
  },
  industry: {
    type: String,
    required: true,
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
  const { _id, name, email, phone, industry } = this;
  return { _id, name, email, phone, industry };
};

//Creates and saves a new JSONWebToken from merchant id and returns said token
MerchantSchema.methods.generateAuthToken = generateAuthToken;

const Merchant = mongoose.model("Merchant", MerchantSchema);

module.exports = Merchant;
