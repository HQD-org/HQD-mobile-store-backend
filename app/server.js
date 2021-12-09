const connectDb = require("./Common/ConnectDb");
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();
const { PORT, ORIGIN_DEV, ORIGIN_PROD } = require("./Common/Config");
const router = require("./Routes/Index.Route");
const paypal = require('./config/paypal');

app.use(
  cors({
    origin: [ORIGIN_DEV, ORIGIN_PROD],
    methods: "GET,POST",
  })
);
//express version from v4.16.0
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/Uploads", express.static("Uploads"));
app.use("/", router);
// Connect to paypal
paypal.connect(process.env.CLIENT_ID,process.env.SECRET_PAYPAL_KEY);
connectDb();

app.listen(PORT, () => console.log(`Listen on port ${PORT}`));
