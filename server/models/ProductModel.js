const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  price: {
    type: Number,
    trim: true,
    required: true,
  },
  image: {
    type: Buffer,
    default: undefined,
  },
  category: {
    type: String,
    required: true,
  },
  merchant: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Merchant",
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
