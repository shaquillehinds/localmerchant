const router = require("express").Router();
const Product = require("../models/ProductModel");
const Featured = require("../models/FeaturedModel");
const { auth } = require("../middleware/auth");
const sharp = require("sharp");
const upload = require("../middleware/upload");

//create a new product
router.route("/").post(auth, upload.array("image", 6), async (req, res) => {
  try {
    const { name, price, description = "" } = req.body;
    const store = req.user._id;
    const tags = JSON.parse(req.body.tags);
    tags.unshift(name);
    while (tags.length > 10) {
      tags.pop();
    }
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
    return res.status(201).send(saved);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.patch("/:id", auth, upload.array(), async (req, res) => {
  const _id = req.query.id;
  const product = await Product.findById(_id);
  const updates = Object.keys(req.body.updates);
  const allowedUpdates = [name, price, tags, description, inStock];
  const valid = updates.every((update) => allowedUpdates.includes(update));
  if (!valid) {
    return res.status(400).send("Invalid update request");
  }
  try {
    updates.forEach((update) => (product[update] = req.body.updates[update]));
    await product.save();
    res.status(202).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/:id/image", auth, upload.array(), async (req, res) => {
  const image = req.body.image;
  const id = req.query.id;
  try {
    const product = await Product.findById(id);
    product.image = image;
    await product.save();
    res.status(202).send(product.image);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.patch("/:id/images", auth, upload.array("images", 6), async (req, res) => {
  const id = req.query.id;
  const images = req.body.images;
  const newImages = req.files.map((image) => image.location);
  newImages.forEach((image) => images.push(image));
  if (images.length > 6) {
    return res.status(400).send("Can only have 6 images per product");
  }
  try {
    const product = await Product.findById(id);
    product.images = images;
    await product.save();
    res.status(202).send(product.images);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.query.id;
  try {
    const product = await Product.findByIdAndDelete(id);
    res.send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

router
  .route("/featured")
  .get(async (req, res) => {
    const featured = await Featured.find().populate("products", { tags: 0, store: 0 }).exec();
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
