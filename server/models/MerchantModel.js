const mongoose = require("mongoose");
const Product = require("./ProductModel");
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
});

MerchantSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "merchant",
});

MerchantSchema.methods.toJSON = function () {
  const { _id, name, email, phone, industry } = this;
  return { _id, name, email, phone, industry };
};

const Merchant = mongoose.model("Merchant", MerchantSchema);

module.exports = Merchant;
