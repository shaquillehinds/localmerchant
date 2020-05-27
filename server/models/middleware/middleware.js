const bcrypt = require("bcrypt");

const hashPassword = async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
};

module.exports = { hashPassword };
