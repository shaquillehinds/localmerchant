const Featured = require("../../models/FeaturedModel");

module.exports = async (parent, { category }) => {
  try {
    if (category === "stores") {
      const stores = await Featured.findOne({ category }).populate("stores").exec();
      return stores.stores;
    }
    const featured = await Featured.findOne({ category }).populate("items").exec();
    return featured.items;
  } catch (e) {
    console.log(e);
  }
};
