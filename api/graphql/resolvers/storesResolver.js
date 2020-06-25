const Store = require("../../models/StoreModel");
module.exports = async (parent, { industry, search, storeName, limit = 25, skip = 0 }, context) => {
  try {
    if (search) {
      return await Store.findPartial({ field: "storeName", characters: search });
    }
    if (storeName) {
      return await Store.find(
        { $text: { $search: storeName } },
        { _id: 1, storeName: 1, storeURL: 1, image: 1, address: 1, phone: 1, parish: 1 }
      )
        .skip(skip)
        .limit(limit);
    }
    let stores;
    console.log(context.token);
    if (industry) {
      stores = await Store.find({ industry });
    } else {
      stores = await Store.find();
    }
    return stores;
  } catch (e) {
    console.log(e);
  }
};
