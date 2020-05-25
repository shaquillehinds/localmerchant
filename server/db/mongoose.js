const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
