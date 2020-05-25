const express = require("express");
const Dotenv = require("dotenv");
require("./db/mongoose");

const app = express();
Dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
