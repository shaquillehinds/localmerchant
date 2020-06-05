const next = require("next");
const { app: express, server } = require("./api/app");
const socketIO = require("socket.io");
const connect = require("./api/routers/chatRoute");
const Featured = require("./api/models/FeaturedModel");
const Schedule = require("./utility/functions");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const io = socketIO(server, { path: "/api/chat" });

app.prepare().then(() => {
  express.get("*", (req, res) => handle(req, res));

  io.on("connect", async (socket) => connect(socket, io));

  const clearWeeklyViews = new Schedule(async () => {
    if (new Date().getDate() === 7) {
      const featured = await Featured.findOne({ category: "weekly_trends" });
      featured.weeklyViews = [];
      featured.save();
    }
  }, 60000 * 60 * 24);
  clearWeeklyViews.start();

  const updateTrends = new Schedule(async () => {
    const topTen = await Featured.aggregate([
      { $match: { category: "weekly_trends" } },
      { $unwind: "$weeklyViews" },
      { $sort: { "weeklyViews.views": -1 } },
      { $limit: 10 },
      { $set: { products: "$weeklyViews.product" } },
      { $project: { products: "$products" } },
    ]);
    const products = topTen.map((top) => top.products);
    await Featured.findOneAndUpdate(
      { category: "weekly_trends" },
      { products }
    );
  }, 60000);
  updateTrends.start();

  const PORT = process.env.PORT;

  server.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
});
