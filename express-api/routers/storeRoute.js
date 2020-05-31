const router = require("express").Router();
const Store = require("../models/StoreModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer();

//get merchant products
router.get("/:businessURL/products", async (req, res) => {
  const businessURL = req.params.businessURL;
  try {
    const store = await Store.findOne({ businessURL }).populate("products", { __v: 0 }).exec();
    res.send(store.products);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//get stores, post a new store
router
  .route("/")
  .get(async (req, res) => {
    let limit, skip;
    req.query.limit ? (limit = req.query.limit) : (limit = 25);
    req.query.skip ? (skip = req.query.skip) : (skip = 0);
    if (req.query.search) {
      const businessName = req.query.search;
      try {
        const results = await Store.find({ $text: { $search: businessName } }, { tags: 0 })
          .limit(limit)
          .skip(skip);
        return res.send(results);
      } catch (e) {
        return res.status(400).send(e);
      }
    }
    try {
      const stores = await Store.find().limit(limit).skip(skip);
      res.send(stores);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(upload.array(), async (req, res) => {
    try {
      req.body.businessURL = req.body.businessName.replace(/\s/g, "").toLowerCase();
      const store = new Store(req.body);
      const token = await store.generateAuthToken();
      // s stands for saved
      await store.save();
      res.status(201).send({ token });
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  });

router.get("/search", async (req, res) => {
  const name = req.query.name;
  try {
    const results = await Store.findPartial("businessName", name);
    res.send(results);
  } catch (e) {
    res.status(400);
  }
});

module.exports = router;
