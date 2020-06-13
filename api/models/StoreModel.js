const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAuthToken } = require("./methods&statics/methods");
const { findPartial } = require("./methods&statics/statics");
const { findAndLogin } = require("./methods&statics/statics");
const { hashPassword } = require("./middleware/middleware");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
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
    storeName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    storeURL: {
      type: String,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      default: undefined,
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
    parish: {
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
      minlength: 7,
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
        },
      },
    ],
    purchaseTokens: [
      {
        type: {
          type: String,
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

StoreSchema.index({ storeName: "text" });

StoreSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "store",
});

//hash password before saving if modified or new
StoreSchema.pre("save", hashPassword);

//
StoreSchema.statics.findPartial = findPartial;

//configures the JSON response to only send certain fields
StoreSchema.methods.toJSON = function () {
  const {
    _id,
    firstName,
    lastName,
    storeName,
    storeURL,
    image,
    email,
    phone,
    industry,
    address,
    coord,
    purchaseTokens,
  } = this;
  return {
    _id,
    firstName,
    lastName,
    storeName,
    storeURL,
    image,
    email,
    phone,
    industry,
    address,
    coord,
    purchaseTokens,
  };
};

//Creates and saves a new JSONWebToken from Store id and returns said token
StoreSchema.methods.generateAuthToken = generateAuthToken;

StoreSchema.statics.findAndLogin = findAndLogin;

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;
