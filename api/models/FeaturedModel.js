const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeaturedSchema = new Schema({
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  stores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
  ],
  category: {
    type: String,
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
  const { weeklyViews, items, stores, category } = this;
  return { weeklyViews, items, stores, category };
};

const Featured = mongoose.model("Featured", FeaturedSchema);

module.exports = Featured;
