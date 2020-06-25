const mongoose = require("mongoose");
const Product = require("../../models/ProductModel");
const Featured = require("../../models/FeaturedModel");

module.exports = async (parent, args) => {
  try {
    if (args.id) {
      const item = await Featured.updateOne(
        {
          category: "weekly_trends",
          "weeklyViews.product": new mongoose.Types.ObjectId(args.id),
        },
        { $inc: { "weeklyViews.$.views": 1 } }
      );
      if (item.n !== 1) {
        const newItem = await Featured.findOne({
          category: "weekly_trends",
        });
        newItem.weeklyViews.push({ views: 1, product: args.id });
        newItem.save();
      }
      return await Product.findById(args.id).populate("store");
    }
  } catch (e) {
    console.log(e);
  }
};
