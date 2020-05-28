const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const emailSuperToken = require("../mail/emailSuperToken");
const multer = require("multer");
const upload = multer();

router
  .route("/login")
  .get(async (req, res) => {
    if (req.query.token) {
      const valid = jwt.verify(req.query.token, process.env.JWT_SECRET);
      if (valid) {
        return res.send(req.query.token);
      }
    }
    res.status(400).send();
  })
  .post(upload.array(), async (req, res) => {
    const { email, password } = req.body;
    const response = await Admin.findAndLogin(email, password);
    if (response.token instanceof Error) {
      return res.status(400).send("Unable to login.");
    }
    if (response.rank) {
      const url = `${process.env.APP_URL}/admin/login?token=${response.token}`;
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
    await newAdmin.save();
    if (req.body.rank === "super admin") {
      const url = `${process.env.APP_URL}/admin/login?token=${token}`;
      const info = await emailSuperToken(url);
      if (info instanceof Error) {
        return res.status(500).send("Error");
      }
      console.log(info.messageId);
      return res.send("Email sent");
    }
    const { _id, name, rank } = newAdmin;
    res.status(201).send({ _id, name, rank, token });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
