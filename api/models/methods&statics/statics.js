const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const findAndLogin = async function (email, password, sessionToken) {
  try {
    const found = await this.findOne({ email });
    const isValid = await bcrypt.compare(password, found.password);
    if (!isValid) {
      throw new Error();
    }
    if (sessionToken && found.tokens[0]) {
      const tokens = found.tokens.filter((toke) => toke.token === sessionToken);
      if (!tokens[0]) tokens[0] = "mismatch";
      const token = tokens[0].token;
      if (token) {
        const verify = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) return false;
          return true;
        });
        if (verify) {
          return token;
        }
        const removeExpired = found.tokens.filter((toke) => toke.token !== sessionToken);
        found.tokens = removeExpired;
      }
    }
    const token = await found.generateAuthToken();
    if (found.rank) {
      if (found.rank === "super admin") {
        return { email, token };
      }
    }
    return token;
  } catch (e) {
    console.log(e);
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
