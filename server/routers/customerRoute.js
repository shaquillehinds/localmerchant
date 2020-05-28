const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const Customer = require("../models/CustomerModel");

//create a new customer
router.post("/customer", upload.array(), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const customer = new Customer({ name, email, password });
    const saved = await customer.save();
    res.status(201).send(saved);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
