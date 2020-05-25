const router = require("express").Router();
const Merchant = require("../models/MerchantModel");
const multer = require("multer");
const upload = multer();

//get merchant products
router.get("/:id/products", async (req, res) => {
  const id = req.params.id;
  try {
    const merchant = await Merchant.findById(id).populate("products").exec();
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
      // s stands for saved
      const { name: sname, email: semail, _id: sid } = await merchant.save();
      const saved = { sname, semail, sid };
      res.status(201).send(saved);
    } catch (e) {
      res.status(500).send(e);
    }
  });

module.exports = router;
