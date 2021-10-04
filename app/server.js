const bodyParser = require("body-parser");
const connectDb = require("./Common/ConnectDb");
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();
const { PORT, ORIGIN_DEV } = require("./Common/Config");
const router = require("./Routes/Index.Route");

app.use(
  cors({
    origin: [ORIGIN_DEV, ORIGIN_PROD],
    methods: "GET,POST",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", router);
connectDb();

app.listen(PORT, () => console.log(`Listen on port ${PORT}`));
