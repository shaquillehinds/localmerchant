const router = require("express").Router();
const Product = require("../models/ProductModel");
const Featured = require("../models/FeaturedModel");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const S3 = require("aws-sdk/clients/s3");
const s3 = new S3();
const mongoose = require("mongoose");

s3.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "us-east-2",
});

router.get("/categories", async (req, res) => {
  const level = req.query.level || "one";
  const category = req.query.category;
  mongoose.connection.db.collection("categories", async (err, collection) => {
    if (err) {
      return res.send(err);
    }
    if (level === "seven") return res.status(200).send([]);
    if (category) {
      try {
        const test = await collection
          .aggregate([
            { $match: { level } },
            { $unwind: `$categories.${category}` },
            { $project: { category: `$categories.${category}` } },
            { $group: { _id: "$_id", category: { $push: "$category" } } },
          ])
          .toArray();
        if (test[0]) return res.status(200).send(test[0].category);
        return res.status(200).send([]);
      } catch (e) {
        res.send(e);
      }
    }
    const proj = await collection.findOne({ level });
    if (proj.categories) return res.status(200).send(proj.categories);
    return res.status(200).send([]);
  });
});
//create a new product
router.post("/", auth, upload.array("image", 6), async (req, res) => {
  try {
    const { name, price, description = "", inStock = true } = req.body;
    const store = req.user._id;
    const tags = JSON.parse(req.body.tags);
    while (tags.length > 18) {
      tags.pop();
    }
    const images = req.files.map((image) => image.location);
    const image = images[0];
    const product = new Product({
      name,
      price,
      tags,
      store,
      inStock,
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

router
  .route("/:id")
  .patch(auth, upload.array(), async (req, res) => {
    const _id = req.params.id;
    const product = await Product.findById(_id);
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "price", "tags", "description", "inStock"];
    const valid = updates.every((update) => allowedUpdates.includes(update));
    if (!valid) {
      return res.status(400).send("Invalid update request");
    }
    try {
      updates.forEach((update) => {
        if (update === "tags") product[update] = JSON.parse(req.body[update]);
        else product[update] = req.body[update];
      });
      await product.save();
      res.status(202).send(req.user);
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  })
  .delete(auth, async (req, res) => {
    const id = req.params.id;
    try {
      const product = await Product.findByIdAndDelete(id);
      if (product.image) {
        let Key = product.image.split("/").pop();
        s3.deleteObject({ Bucket: "local-merchant", Key }, (err, data) => {
          if (err) console.log(err);
          else console.log(data);
        });
      }
      if (product.images.length > 0) {
        product.images.forEach((image, index) => {
          if (index === 0) null;
          else
            s3.deleteObject({ Bucket: "local-merchant", Key: image.split("/").pop() }, (err, data) => {
              if (err) console.log(err);
              else console.log(data);
            });
        });
      }
      res.send(product);
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
  .post(auth, async (req, res) => {
    if (req.query.product) {
      const tokenIndex = req.user.purchaseTokens.findIndex((token) => token.type === "FPT");
      if (tokenIndex != -1) {
        if (req.user.purchaseTokens[tokenIndex].quantity > 0) {
          req.user.purchaseTokens[tokenIndex].quantity -= 1;
          try {
            const featuredProducts = await Featured.findOne({ category: "products" });
            featuredProducts.items.push(req.query.product);
            await featuredProducts.save();
            req.user.save();
            return res.send("Product Added To Featured Items");
          } catch (e) {
            return res.status(400).send(e);
          }
        }
      }
      return res.status(400).send("Insuffecient Tokens");
    }
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
