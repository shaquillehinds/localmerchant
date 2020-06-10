const mongoose = require("mongoose");

const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI_DEV, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Connected to DB");
    return connection;
  } catch (e) {
    return e;
  }
};

module.exports = connect;
