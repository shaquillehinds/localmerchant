const mongoose = require("mongoose");

module.exports = async (parent, { level, category }) => {
  try {
    const collection = mongoose.connection.db.collection("categories");
    if (level === "seven") return { subCategories: [] };
    if (category && level) {
      const test = await collection
        .aggregate([
          { $match: { level } },
          { $unwind: `$categories.${category}` },
          { $project: { category: `$categories.${category}` } },
          { $group: { _id: "$_id", category: { $push: "$category" } } },
        ])
        .toArray();
      if (test[0]) return { subCategories: test[0].category };
      return { subCategories: [] };
    } else if (level) {
      const proj = await collection.findOne({ level });
      if (proj.categories) return { main: proj.categories };
    } else if (category) {
      const allLevels = (await (await collection.find({ level: "all" })).toArray())[0].categories;
      const tails = (await (await collection.find({ level: "tail" })).toArray())[0].categories;
      const main = { allLevels, tails };
      return { main };
    }
    return { subCategories: [] };
  } catch (e) {
    console.log(e);
  }
};
