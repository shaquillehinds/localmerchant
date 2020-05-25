const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
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
  watchlist: {
    type: [Schema.Types.ObjectId],
  },
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
