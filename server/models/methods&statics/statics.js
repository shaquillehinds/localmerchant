const bcrypt = require("bcrypt");

const findAndLogin = async function (email, password) {
  try {
    const found = await this.findOne({ email });
    const isValid = await bcrypt.compare(password, found.password);
    if (isValid) {
      const token = found.generateAuthToken();
      return token;
    }
  } catch (e) {
    return new Error();
  }
};

const findPartial = async function (field, characters, limit = 10) {
  const search = {};
  search[field] = new RegExp(characters, "gi");
  return await this.find(search).limit(limit);
};

module.exports = { findAndLogin, findPartial };
