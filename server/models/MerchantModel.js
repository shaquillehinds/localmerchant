const mongoose = require("mongoose");
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

const Merchant = mongoose.model("Merchant", MerchantSchema);

module.exports = Merchant;
