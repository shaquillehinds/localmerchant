const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { auth } = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const { id, type, quantity = 1 } = req.body;
  let amount;
  type === "FPT" ? (amount = 1000) : (amount = 500);
  amount *= quantity;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "BBD",
      description: "Token Purchase",
      payment_method: id,
      confirm: true,
    });
    if (payment.status == "succeeded") {
      if (req.user.purchaseTokens) {
        const token = req.user.purchaseTokens.filter((toke) => toke.type === type);
        if (token.length > 0) {
          console.log(token[0].quantity, quantity);
          token[0].quantity += quantity;
          const tokens = req.user.purchaseTokens.filter((toke) => toke.type !== type);
          tokens.push(token[0]);
          req.user.purchaseTokens = tokens;
        } else req.user.purchaseTokens.push({ type, quantity });
      } else {
        req.user.purchaseTokens = [{ type, quantity }];
      }
      req.user.save();
      return res.status(200).send({
        confirm: "abc123",
      });
    }
  } catch (error) {
    return res.status(400).send({ failed: error.raw.message });
  }
});

module.exports = router;
