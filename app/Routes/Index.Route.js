const express = require("express");
const { PREFIX_PATH } = require("../Common/RoutePath");
const router = express.Router();

router.use(`/${PREFIX_PATH.ADMIN}`, require("./Admin.Route"));
router.use(`/${PREFIX_PATH.AUTH}`, require("./Auth.Route"));

module.exports = router;
