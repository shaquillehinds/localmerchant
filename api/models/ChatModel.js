const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  messages: [
    {
      message: {
        type: String,
      },
      createdAt: {
        type: Number,
      },
      owner: {
        type: Schema.Types.ObjectId,
      },
    },
  ],
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
