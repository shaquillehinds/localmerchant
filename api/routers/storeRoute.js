const router = require("express").Router();
const Store = require("../models/StoreModel");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const upload = multer();

//get stores, post a new store
router.post("/", upload.array("image"), async (req, res) => {
  try {
    req.body.storeURL = req.body.storeName.replace(/\s/g, "").toLowerCase();
    const nameExists = await Store.findOne({ storeName: req.body.storeName });
    if (nameExists) {
      return res.send({ storeName: "Store name already exists." });
    }
    const emailExists = await Store.findOne({ email: req.body.email });
    if (emailExists) {
      return res.send({ email: "This email is already in use." });
    }
    const store = new Store(req.body);
    const token = await store.generateAuthToken();
    req.session.token = token;
    return res.status(201).send({ token });
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
});

router.post("/login", upload.array(), async (req, res) => {
  try {
    const token = await Store.findAndLogin(req.body.email, req.body.password, req.session.token);
    if (typeof token === "string") {
      req.session.token = token;
      if (req.session.customer) delete req.session.customer;
      return res.send(token);
    }
    return res.status(400).send();
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post("/logout", auth, upload.array(), async (req, res) => {
  try {
    const tokens = req.user.tokens.filter((token) => token.token !== req.user.token);
    req.user.tokens = tokens;
    const user = await req.user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/", auth, upload.array(), async (req, res) => {
  console.log(req.body);
  const updates = Object.keys(req.body.updates);
  const allowedUpdates = [
    "firstName",
    "lastName",
    "storeName",
    "storeURL",
    "email",
    "phone",
    "image",
    "industry",
    "address",
    "password",
    "categories",
    "coord",
  ];
  const valid = updates.every((update) => allowedUpdates.includes(update));
  if (!valid) {
    return res.status(400).send("Invalid update request");
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body.updates[update]));
    if (req.files) {
      if (req.files[0].location) {
        req.user.image = req.files[0].location;
      }
    }
    await req.user.save();
    res.status(202).send(req.user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    const user = await Store.findByIdAndDelete(req.user._id);
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
