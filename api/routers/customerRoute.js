const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const Customer = require("../models/CustomerModel");

//create a new customer
router.post("/", upload.array(), async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const token = await customer.generateAuthToken();
    res.status(201).send({ token });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
