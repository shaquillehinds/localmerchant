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

const findPartial = async function ({
  field,
  characters,
  limit = 10,
  field2,
  characters2,
  skip = 0,
  sort = { createdAt: -1 },
}) {
  const search = {};
  field ? (search[field] = new RegExp(characters, "gi")) : null;
  if (field === "name") {
    return await this.find(search, { name: 1, _id: 1 }, { limit });
  } else if (field === "storeName") {
    return await this.find(search, { storeName: 1, storeURL: 1, _id: 1 }, { limit });
  } else if (field2 === "store") {
    search[field2] = characters2;
    return await this.find(
      search,
      {
        tags: 0,
        images: 0,
        description: 0,
      },
      { limit, sort, skip, populate: "store" }
    );
  } else if (field2 === "delivery" || field2 === "inStock") {
    search[field2] = true;
    return await this.find(
      search,
      {
        tags: 0,
        images: 0,
        description: 0,
      },
      { limit, sort, skip, populate: "store" }
    );
  }
};

module.exports = { findAndLogin, findPartial };
