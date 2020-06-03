const next = require("next");
const express = require("./api/app");
const Featured = require("./api/models/FeaturedModel");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  express.get("*", (req, res) => handle(req, res));

  setInterval(async () => {
    if (new Date().getDate() === 7) {
      const featured = await Featured.findOne({ category: "weekly_trends" });
      featured.weeklyViews = [];
      featured.save();
    }
  }, 60000 * 60 * 24);

  const PORT = process.env.PORT;

  express.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
});
