const bcrypt = require("bcrypt");

const findAndLogin = async function (email, password) {
  try {
    const found = await this.findOne({ email });
    const isValid = await bcrypt.compare(password, found.password);
    if (!isValid) {
      throw new Error();
    }
    const token = await found.generateAuthToken();
    if (found.rank) {
      if (found.rank === "super admin") {
        return { email, token };
      }
    }
    return token;
  } catch (e) {
    return e;
  }
};

const findPartial = async function (field, characters, limit = 10) {
  const search = {};
  search[field] = new RegExp(characters, "gi");
  if (field === "name") {
    return await this.find(search, { name: 1, _id: 1 }).limit(limit);
  }
  return await this.find(search, {
    businessName: 1,
    businessURL: 1,
    _id: 1,
  }).limit(limit);
};

module.exports = { findAndLogin, findPartial };
