const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const Product = require("../models/ProductModel");
const { auth } = require("../middleware/auth");

//create a new product
router
  .route("/")
  .post(upload.array(), auth, async (req, res) => {
    try {
      const { name, price, tags } = req.body;
      const merchant = req.user._id;
      const product = new Product({ name, price, tags, merchant });
      const saved = await product.save();
      res.status(201).send(saved);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .get(async (req, res) => {
    const tag = req.query.tag;
    let limit;
    req.query.limit ? (limit = req.query.limit) : (limit = 25);
    try {
      const results = await Product.find({ $text: { $search: tag } }, { name: 1 }).limit(limit);
      res.send(results);
    } catch (e) {
      res.status(400);
    }
  });

//Query for search bar character entries
router.get("/search", async (req, res) => {
  const name = req.query.name;
  console.log(name);
  try {
    const results = await Product.findPartial("name", name);
    res.send(results);
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports = router;
