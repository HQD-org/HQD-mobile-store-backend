const express = require("express");
const router = express.Router();

router.route("/init").get((req, res) => {
  res.send("Initial");
});

module.exports = router;
