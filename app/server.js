const bodyParser = require("body-parser");
const connectDb = require("./Common/ConnectDb");
require("dotenv").config();
const express = require("express");
const app = express();
const { PORT } = require("./Common/Config");
const router = require("./Routes/index.route");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", router);
connectDb();

app.listen(PORT, () => console.log(`Listen on port ${PORT}`));
