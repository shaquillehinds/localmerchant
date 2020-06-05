const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  messages: [{ type: String }],
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
