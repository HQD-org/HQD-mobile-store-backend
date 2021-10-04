const express = require("express");

const router = express.Router();

router.use("/admin", require("./Admin.Route"));

module.exports = router;
