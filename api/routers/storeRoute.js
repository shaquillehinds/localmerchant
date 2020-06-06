const router = require("express").Router();
const Store = require("../models/StoreModel");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const upload = multer();

//get merchant products
router.get("/:businessURL/products", async (req, res) => {
  const businessURL = req.params.businessURL;
  try {
    const store = await Store.findOne({ businessURL })
      .populate("products", { __v: 0 })
      .exec();
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
        const results = await Store.find(
          { $text: { $search: businessName } },
          { tags: 0 }
        )
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
  .post(upload.array("image"), async (req, res) => {
    try {
      req.body.businessURL = req.body.businessName
        .replace(/\s/g, "")
        .toLowerCase();
      req.body.image = req.files[0].location;
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

router.post("/login", upload.array(), async (req, res) => {
  try {
    console.log(req.body);
    const token = await Store.findAndLogin(req.body.email, req.body.password);
    res.send(token);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post("/logout", auth, upload.array(), async (req, res) => {
  try {
    const tokens = req.user.tokens.filter(
      (token) => token.token !== req.user.token
    );
    req.user.tokens = tokens;
    const user = await req.user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/", auth, upload.array(), async (req, res) => {
  const updates = Object.keys(req.body.updates);
  const allowedUpdates = [
    firstName,
    lastName,
    businessName,
    businessURL,
    email,
    phone,
    image,
    industry,
    address,
    password,
    coord,
  ];
  const valid = updates.every((update) => allowedUpdates.includes(update));
  if (!valid) {
    return res.status(400).send("Invalid update request");
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body.updates[update]));
    if (req.files[0]) {
      if (req.files[0].location) {
        req.user.image = req.files[0].location;
      }
    }
    await req.user.save();
    res.status(202).send(req.user);
  } catch (e) {
    res.status(400).send(e);
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
