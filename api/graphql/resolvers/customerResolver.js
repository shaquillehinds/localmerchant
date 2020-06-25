const Customer = require("../../models/CustomerModel");

module.exports = async (parent, args, context) => {
  try {
    if (args.id) {
      return await Customer.findById(args.id);
    }
  } catch (e) {
    console.log(e);
  }
};
