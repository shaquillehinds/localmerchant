const jwt = require("jsonwebtoken");
const Product = require("../../models/ProductModel");
module.exports = async (
  parent,
  {
    category,
    store,
    tag,
    filter,
    search,
    limit = 25,
    skip = 0,
    sort = { createdAt: -1 },
    private = false,
  },
  { token }
) => {
  try {
    if (store) {
      if (tag || tag === "") {
        return await Product.findPartial({
          field: "tags",
          characters: tag,
          limit,
          skip,
          sort,
          field2: "store",
          characters2: store,
        });
      }
      return await Product.find({ store }).populate("store").skip(skip).limit(limit);
    } else if (search) {
      return await Product.findPartial({ field: "name", characters: search });
    } else if (tag) {
      const filters = {};
      filter ? (filters[filter] = true) : null;
      return await Product.find({ $text: { $search: tag }, ...filters }, null, {
        limit,
        sort,
        skip,
        populate: "store",
      });
    } else if (category) {
      const categorySearch = {};
      categorySearch.tags = category;
      filter ? (categorySearch[filter] = true) : null;
      return await Product.find(categorySearch, null, {
        limit,
        sort,
        skip,
        populate: "store",
      });
    }
    if (token && private) {
      const store = jwt.verify(token, process.env.JWT_SECRET, (error, decrypted) => {
        if (error) return false;
        return decrypted._id;
      });
      return await Product.find({ store }).populate("store").skip(skip).limit(limit);
    }
    return Product.find().populate("store").skip(skip).limit(limit);
  } catch (e) {
    console.log(e);
  }
};
