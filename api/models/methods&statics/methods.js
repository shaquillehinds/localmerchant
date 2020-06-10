const jwt = require("jsonwebtoken");

const generateAuthToken = async function () {
  const _id = this._id.toString();
  let expiresIn = "7d";
  this.rank === "admin" ? (expiresIn = "1d") : (expiresIn = "7d");
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn });
  this.tokens.push({ token });
  await this.save();
  return token;
};

module.exports = { generateAuthToken };
