const Admin = require("../../models/AdminModel");
const jwt = require("jsonwebtoken");

module.exports = async (parent, args, context) => {
  try {
    const decoded = jwt.verify(context.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return false;
      return decoded;
    });
    if (!decoded._id) {
      return "Unauthorized";
    }
    const admin = await Admin.findById(decoded._id);
    if (args.id && admin) {
      return await Admin.findById(args.id);
    }
  } catch (e) {
    return e;
  }
};
