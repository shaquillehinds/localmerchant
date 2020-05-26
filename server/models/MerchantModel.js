const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const MerchantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  industry: {
    type: String,
    required: true,
    trim: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

MerchantSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "merchant",
});

//hash password before saving if modified or new
MerchantSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

//
MerchantSchema.statics.findPartial = async function (field, characters, limit = 10) {
  const search = {};
  search[field] = new RegExp(characters, "gi");
  return await this.find(search).limit(limit);
};

//configures the JSON response to only send certain fields
MerchantSchema.methods.toJSON = function () {
  const { _id, name, email, phone, industry } = this;
  return { _id, name, email, phone, industry };
};

//Creates and saves a new JSONWebToken from merchant id and returns said token
MerchantSchema.methods.generateAuthToken = async function () {
  const _id = this._id.toString();
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  this.tokens.push({ token });
  await this.save();
  return token;
};

const Merchant = mongoose.model("Merchant", MerchantSchema);

module.exports = Merchant;
