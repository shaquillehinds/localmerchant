const jwt = require("jsonwebtoken");
const Store = require("../../models/StoreModel");
module.exports = async (parent, { id, storeURL }, { token }) => {
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return false;
        return decoded;
      });
      if (decoded) return await Store.findById(decoded._id);
    }
    if (id) {
      return await Store.findById(id);
    } else if (storeURL) {
      return await Store.findOne({ storeURL });
    }
  } catch (e) {
    console.log(e);
  }
};
