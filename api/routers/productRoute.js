const router = require("express").Router();
const Product = require("../models/ProductModel");
const Featured = require("../models/FeaturedModel");
const { auth } = require("../middleware/auth");
const sharp = require("sharp");
const upload = require("../middleware/upload");

//create a new product
router
  .route("/")
  .post(auth, upload.array("image", 6), async (req, res) => {
    try {
      const { name, price, tags, description = "" } = req.body;
      const store = req.user._id;
      const images = req.files.map((image) => image.location);
      const image = images[0];
      const product = new Product({
        name,
        price,
        tags,
        store,
        image,
        images,
        description,
      });
      const saved = await product.save();
      res.status(201).send(saved);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .get(async (req, res) => {
    if (!req.query.search) {
      res.status(400).send("Please provide query search");
    }
    const tag = req.query.search;
    let limit, skip;
    req.query.limit ? (limit = req.query.limit) : (limit = 25);
    req.query.skip ? (skip = req.query.skip) : (skip = 0);
    try {
      const results = await Product.find(
        { $text: { $search: tag } },
        { tags: 0 }
      )
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

router.patch("/:id", auth, upload.array(), async (req, res) => {
  const _id = req.query.id;
  const product = await Product.findById(_id);
  const updates = Object.keys(req.body.updates);
  const allowedUpdates = [
    name,
    price,
    image,
    images,
    tags,
    description,
    inStock,
  ];
  const valid = updates.every((update) => allowedUpdates.includes(update));
  if (!valid) {
    return res.status(400).send("Invalid update request");
  }
  try {
    updates.forEach((update) => (product[update] = req.body.updates[update]));
    if (req.files[0]) {
      if (req.files[0].location) {
        product.image = req.files[0].location;
      }
    }
    await product.save();
    res.status(202).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router
  .route("/featured")
  .get(async (req, res) => {
    const featured = await Featured.find()
      .populate("products", { tags: 0, store: 0 })
      .exec();
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
      .populate("products", { tags: 0, store: 0 })
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
        const newList = featured.products.filter(
          (prod) => id !== prod._id.toString()
        );
        featured.products = newList;
        const saved = await featured.save();
        return res.send(saved.products);
      }
      throw new Error();
    } catch (e) {
      return res
        .status(400)
        .send("Unable to fullfil request. Please check parameters.");
    }
  });

module.exports = router;
