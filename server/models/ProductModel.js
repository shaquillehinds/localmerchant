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
  tags: {
    type: Array,
    required: true,
    trim: true,
  },
  merchant: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Merchant",
  },
});

ProductSchema.index({ tags: "text" });

ProductSchema.methods.toJSON = function () {
  const { _id, name, price, merchant } = this;
  return { _id, name, price, merchant };
};

ProductSchema.statics.findPartial = async function (field, characters, limit = 10) {
  const search = {};
  search[field] = new RegExp(characters, "gi");
  return await this.find(search).limit(limit);
};

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
