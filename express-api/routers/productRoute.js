const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const Product = require("../models/ProductModel");
const Featured = require("../models/FeaturedModel");
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
    if (!tag) {
      res.status(400).send("Please provide query tag");
    }
    let limit, skip;
    req.query.limit ? (limit = req.query.limit) : (limit = 25);
    req.query.skip ? (skip = req.query.skip) : (skip = 0);
    try {
      const results = await Product.find({ $text: { $search: tag } }, { tags: 0 })
        .limit(limit)
        .skip(skip);
      res.send(results);
    } catch (e) {
      res.status(400).send(e);
    }
  });

//Query for search bar character entries
router.get("/search", async (req, res) => {
  const name = req.query.name;
  try {
    const results = await Product.findPartial("name", name);
    res.send(results);
  } catch (e) {
    res.status(400).send(e);
  }
});

router
  .route("/featured")
  .get(async (req, res) => {
    const featured = await Featured.find().populate("products", { tags: 0, merchant: 0 }).exec();
    const allArrays = featured.map((category) => category.products);
    let all = [];
    allArrays.forEach((array) => {
      all = all.concat(array);
    });
    res.send(all);
  })
  .post(async (req, res) => {
    const newFeatured = await new Featured(req.body);
    const { _id } = await newFeatured.save();
    res.send(_id);
  });
router
  .route("/featured/:category")
  .get(async (req, res) => {
    const category = req.params.category;
    const featured = await Featured.findOne({ category })
      .populate("products", { tags: 0, merchant: 0 })
      .exec();
    res.send(featured.products);
  })
  .patch(async (req, res) => {
    const category = req.params.category;
    const update = req.query.update;
    const id = req.query.id;
    if (!update || !id) {
      return res.status(400).send("Invalid request");
    } else if (id.length !== 24) {
      return res.status(400).send("Invalid product id");
    }
    try {
      const featured = await Featured.findOne({ category });
      if (update === "add") {
        featured.products.push(id);
        const saved = await featured.save();
        return res.send(saved.products);
      } else if (update === "remove") {
        const newList = featured.products.filter((prod) => id !== prod._id.toString());
        featured.products = newList;
        const saved = await featured.save();
        return res.send(saved.products);
      }
      throw new Error();
    } catch (e) {
      return res.status(400).send("Unable to fullfil request. Please check parameters.");
    }
  });

module.exports = router;
