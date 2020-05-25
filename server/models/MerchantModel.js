const mongoose = require("mongoose");
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
});

const Merchant = mongoose.model("Merchant", MerchantSchema);

export default Merchant;
