const next = require("next");
const express = require("./express-app/app");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  express.get("*", (req, res) => handle(req, res));

  const PORT = process.env.PORT;

  express.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
});
