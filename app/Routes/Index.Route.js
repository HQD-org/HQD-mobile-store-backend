const express = require("express");
const { PREFIX_PATH } = require("../Common/RoutePath");
const router = express.Router();

router.use(`/${PREFIX_PATH.ADMIN}`, require("./Admin.Route"));
router.use(`/${PREFIX_PATH.AUTH}`, require("./Auth.Route"));
router.use(`/${PREFIX_PATH.MOBILE_BRAND}`, require("./MobileBrand.Route"));
router.use(`/${PREFIX_PATH.MOBILE_MODEL}`, require("./MobileModel.Route"));
router.use('/user',require("./User.Route"));
router.use('/branch',require("./Branch.Route"));
router.use('/product',require("./Product.Route"));
module.exports = router;
