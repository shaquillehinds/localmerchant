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
    phone2: {
      type: Number,
      minlength: 7,
    },
    storeType: {
      type: String,
      trim: true,
    },
    rank: {
      type: String,
      default: "Bronze",
      trim: true,
    },
    open: [
      {
        days: [
          {
            type: Number,
            default: [1, 2, 3, 4, 5],
          },
        ],
        opening: {
          type: String,
          default: "0800",
        },
        closing: {
          type: String,
          default: "1700",
        },
      },
    ],
    categories: [
      {
        name: {
          type: String,
        },
        category: [{ type: String }],
      },
    ],
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
    phone2,
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
    phone2,
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
