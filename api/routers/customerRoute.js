const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const Customer = require("../models/CustomerModel");
const { authCustomer } = require("../middleware/auth");

//create a new customer
router.post("/", upload.array(), async (req, res) => {
  try {
    const nameExists = await Customer.findOne({ userName: req.body.userName });
    if (nameExists) {
      return res.send({ userName: "Username already exists." });
    }
    const emailExists = await Customer.findOne({ email: req.body.email });
    if (emailExists) {
      return res.send({ email: "This email is already in use." });
    }
    const customer = new Customer(req.body);
    const token = await customer.generateAuthToken();
    req.session.token = token;
    return res.status(201).send({ token });
  } catch (e) {
    return res.status(400).send(e);
  }
});
router.post("/login", upload.array(), async (req, res) => {
  try {
    const token = await Customer.findAndLogin(req.body.email, req.body.password, req.session.token);
    if (typeof token === "string") {
      req.session.token = token;
      return res.send(token);
    }
    return res.status(400).send();
  } catch (e) {
    return res.status(400).send(e);
  }
});
router.post("/logout", authCustomer, async (req, res) => {
  try {
    const tokens = req.user.tokens.filter((token) => token.token !== req.user.token);
    req.user.tokens = tokens;
    const user = await req.user.save();
    return res.send(user);
  } catch (e) {
    return res.status(500).send(e);
  }
});
router.patch("/", authCustomer, async (req, res) => {
  const updates = Object.keys(req.body.updates);
  const allowedUpdates = [userName, firstName, lastName, password, address, phone, email, coord];
  const valid = updates.forEvery((update) => allowedUpdates.includes(update));
  if (!valid) {
    return res.status(400).send("Invalid update request");
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body.updates[update]));
    await req.user.save();
    return res.send(202).send(req.user);
  } catch (e) {
    return res.status(500).send(e);
  }
});
router.delete("/", authCustomer, async (req, res) => {
  try {
    const user = await Customer.findByIdAndDelete(req.user._id);
    return res.send(user);
  } catch (e) {
    return res.status(400).send(e);
  }
});

module.exports = router;
