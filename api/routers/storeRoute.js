const router = require("express").Router();
const Store = require("../models/StoreModel");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const upload = multer();

//get stores, post a new store
router.post("/", upload.array("image"), async (req, res) => {
  try {
    req.body.storeURL = req.body.storeName.replace(/\s/g, "").toLowerCase();
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
    storeName,
    storeURL,
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

router.delete("/", auth, async (req, res) => {
  try {
    const user = await Store.findByIdAndDelete(req.user._id);
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
