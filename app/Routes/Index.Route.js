const express = require("express");
const { PREFIX_PATH } = require("../Common/RoutePath");
const router = express.Router();

router.use(`/${PREFIX_PATH.ADMIN}`, require("./Admin.Route"));
router.use(`/${PREFIX_PATH.AUTH}`, require("./Auth.Route"));
router.use(`/${PREFIX_PATH.MOBILE_BRAND}`, require("./MobileBrand.Route"));
router.use(`/${PREFIX_PATH.MOBILE_MODEL}`, require("./MobileModel.Route"));
router.use(`/${PREFIX_PATH.BRANCH}`, require("./Branch.Route"));
router.use(`/${PREFIX_PATH.PRODUCT}`, require("./Product.Route"));
router.use(`/${PREFIX_PATH.USER}`, require("./User.Route"));
router.use('/cart',require("./Cart.Route"));

module.exports = router;
