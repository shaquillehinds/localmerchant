const jwt = require("jsonwebtoken");

const generateAuthToken = async function () {
  const _id = this._id.toString();
  const expires = {};
  this.rank === "admin"
    ? (expires.expiresIn = "1d")
    : (expires.expiresIn = "7d");
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, expires);
  this.tokens.push({ token });
  await this.save();
  return token;
};

module.exports = { generateAuthToken };
