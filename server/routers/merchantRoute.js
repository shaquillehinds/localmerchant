const router = require("express").Router();
const Merchant = require("../models/MerchantModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer();

//get merchant products
router.get("/:name/products", async (req, res) => {
  const name = req.params.name;
  try {
    const merchant = await Merchant.findOne({ name }).populate("products", { __v: 0 }).lean().exec();
    res.send(merchant.products);
  } catch (e) {
    res.status(500).send(e);
  }
});

//get merchants, post a new merchant
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
      const merchant = new Merchant(req.body);
      const token = await merchant.generateAuthToken();
      // s stands for saved
      await merchant.save();
      res.status(201).send({ token });
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  });

router.get("/search", async (req, res) => {
  const name = req.query.name;
  try {
    const results = await Merchant.findPartial("name", name);
    res.send(results);
  } catch (e) {
    res.status(400);
  }
});

module.exports = router;
