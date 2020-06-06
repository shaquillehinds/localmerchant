const mongoose = require("mongoose");
const { generateAuthToken } = require("../models/methods&statics/methods");
const { hashPassword } = require("./middleware/middleware");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
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
  address: {
    type: String,
    trim: true,
  },
  phone: {
    type: Number,
    minlength: 7,
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
  watchlist: {
    type: [Schema.Types.ObjectId],
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

CustomerSchema.methods.toJSON = function () {
  const { _id, userName, firstName, lastName, email, address, phone, coord, watchlist } = this;
  return { _id, userName, firstName, lastName, email, address, phone, coord, watchlist };
};

CustomerSchema.methods.generateAuthToken = generateAuthToken;

CustomerSchema.pre("save", hashPassword);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
