const express = require("express");
const router = express.Router();
const controller = require("../Controllers/Coupon.Controller");
const { schema } = require("../Validations/Coupon.Validation");
const { validateBody } = require("../Validations/Validation");
const { validateQuery } = require("../Validations/Validation");
const { ROLE } = require("../Common/Constants");
const { isRole } = require("../Middlewares/Role.Middleware");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const { COUPON_PATH } = require("../Common/RoutePath");

router
  .route(`/${COUPON_PATH.CREATE}`)
  .post(
    [validateBody(schema.create), verifyToken, isRole([ROLE.ADMIN])],
    controller.handleCreate
  );

router.route(`/${COUPON_PATH.GET_ALL}`).get(controller.handleGetAll);

router
  .route(`/${COUPON_PATH.UPDATE}`)
  .post(
    [validateBody(schema.update), verifyToken, isRole([ROLE.ADMIN])],
    controller.handleUpdate
  );

router.route(`/${COUPON_PATH.FILTER}`).get(controller.handleFilter);

router
  .route(`/${COUPON_PATH.USE}`)
  .get([validateBody(schema.use)], controller.handleUse);

router.route(`/${COUPON_PATH.FINDBYNAME}`).get(controller.handleFindCouponByName);

module.exports = router;
