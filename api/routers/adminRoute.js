const router = require("express").Router();
const Admin = require("../models/AdminModel");
const { authAdmin } = require("../middleware/auth");
const emailSuperToken = require("../mail/emailSuperToken");
const multer = require("multer");
const upload = multer();

router.post("login", upload.array(), async (req, res) => {
  const { email, password } = req.body;
  const response = await Admin.findAndLogin(email, password);
  if (response.token instanceof Error) {
    return res.status(400).send("Unable to login.");
  }
  if (response.rank) {
    const url = `${process.env.APP_URL}/api/admin/login?token=${response.token}`;
    const info = await emailSuperToken(url);
    console.log(info.messageId);
    return res.send("Email Sent");
  }
  res.send(response.token);
});

router.post("/", upload.array(), async (req, res) => {
  const newAdmin = new Admin(req.body);
  try {
    const token = await newAdmin.generateAuthToken();
    if (req.body.rank === "super admin") {
      const url = `${process.env.APP_URL}/api/admin/login?token=${token}`;
      await emailSuperToken(url);
      return res.send("Email sent");
    }
    const { _id, name, email, rank } = newAdmin;
    await newAdmin.save();
    await emailSuperToken(
      `A new admin tried to register. _id:${_id}, name: ${name}, email: ${email}, rank: ${rank}, JWT:${token}`
    );
    res.status(201).send(`Email sent to super admin, if you're approved you will recieve an email.`);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/logout", authAdmin, async (req, res) => {
  try {
    const tokens = req.user.tokens.filter((token) => token.token !== req.user.token);
    req.user.tokens = tokens;
    const user = await req.user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
