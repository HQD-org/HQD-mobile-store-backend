require("dotenv").config();
const express = require("express");
const connectDb = require("./common/connectDb");
const app = express();
const { PORT } = require("./common/config");
const router = require("./routes/index.route");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

connectDb();

app.listen(PORT, () => console.log(`Listen on port ${PORT}`));
