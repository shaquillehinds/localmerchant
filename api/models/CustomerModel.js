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
  watchlist: {
    type: [Schema.Types.ObjectId],
  },
  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
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
  const { _id, userName, firstName, lastName, email, watchlist, chats } = this;
  return { _id, userName, firstName, lastName, email, watchlist, chats };
};

CustomerSchema.methods.generateAuthToken = generateAuthToken;

CustomerSchema.pre("save", hashPassword);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
