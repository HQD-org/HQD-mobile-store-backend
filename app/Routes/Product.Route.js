const { PRODUCT_PATH } = require("../Common/RoutePath");
const controller = require("../Controllers/Product.Controller");
const express = require("express");
const { schema } = require("../Validations/Product.Validation");
const { validateBody } = require("../Validations/Validation");
const { isRole } = require("../Middlewares/Role.Middleware");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const { ROLE } = require("../Common/Constants");
const router = express.Router();

router
  .route(`/${PRODUCT_PATH.CREATE}`)
  .post(
    [validateBody(schema.create), verifyToken, isRole(ROLE.ADMIN)],
    controller.handleCreateProduct
  );

router
  .route(`/${PRODUCT_PATH.UPDATE}`)
  .post(
    [validateBody(schema.update), verifyToken, isRole(ROLE.ADMIN)],
    controller.handleUpdateProduct
  );

router
  .route(`/${PRODUCT_PATH.UPDATE_QUANTITY}`)
  .post(
    [
      validateBody(schema.updateQuantity),
      verifyToken,
      isRole([ROLE.ADMIN, ROLE.MANAGER_BRANCH]),
    ],
    controller.handleUpdateQuantityProduct
  );

router.route(`/${PRODUCT_PATH.FIND_BY_ID}/:id`).get(controller.handleFindById);

router.route(`/${PRODUCT_PATH.GET_ALL}`).get(controller.handleGetAll);

router.route(`/${PRODUCT_PATH.FILTER}`).get(controller.handleFilter);

router
  .route(`/${PRODUCT_PATH.GET_GROUP_BY_BRAND}`)
  .get(controller.handleGetProductGroupByBrand);

module.exports = router;
