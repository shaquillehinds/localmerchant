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
});

FeaturedSchema.methods.toJSON = () => {
  const { products, category } = this;
  return { products, category };
};

const Featured = mongoose.model("Featured", FeaturedSchema);

module.exports = Featured;
