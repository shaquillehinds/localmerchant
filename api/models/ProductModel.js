const mongoose = require("mongoose");
const { findPartial } = require("./methods&statics/statics");
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
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
  },
  tags: {
    type: Array,
    required: true,
    trim: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  store: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Store",
  },
});

ProductSchema.index({ tags: "text" });

ProductSchema.methods.toJSON = function () {
  const { _id, name, price, image, images, tags, store, description, inStock } = this;
  return { _id, name, price, image, images, tags, store, description, inStock };
};

ProductSchema.statics.findPartial = findPartial;

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
