const router = require("express").Router();
const Merchant = require("../models/MerchantModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer();

//get merchant products
router.get("/:name/products", async (req, res) => {
  const name = req.params.name;
  try {
    const merchant = await Merchant.findOne({ name })
      .populate("products")
      .exec();
    res.send(merchant.products);
  } catch (e) {
    res.status(500).send(e);
  }
});

//create a new merchant
router
  .route("/")
  .get(async (req, res) => {
    try {
      const merchants = await Merchant.find();
      res.send(merchants);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(upload.array(), async (req, res) => {
    try {
      const { name, email, password, phone, industry } = req.body;
      const merchant = new Merchant({ name, email, password, phone, industry });
      const token = await merchant.generateAuthToken();
      // s stands for saved
      const { id } = await merchant.save();
      const saved = { name, email, id, token };
      res.status(201).send(saved);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  });

module.exports = router;
