const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeaturedSchema = new Schema({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  category: {
    type: String,
    required: true,
    trim: true,
  },
  weeklyViews: [
    {
      views: Number,
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
});

FeaturedSchema.methods.toJSON = function () {
  const { weeklyViews, products, category } = this;
  return { weeklyViews, products, category };
};

const Featured = mongoose.model("Featured", FeaturedSchema);

module.exports = Featured;
