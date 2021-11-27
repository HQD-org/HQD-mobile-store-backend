const { PRODUCT_PATH } = require("../Common/RoutePath");
const controller = require("../Controllers/Product.Controller");
const express = require("express");
const { schema } = require("../Validations/Product.Validation");
const { validateQuery, validateBody } = require("../Validations/Validation");
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
  .route(`/${PRODUCT_PATH.GETDATA}`)
  .get([validateQuery(schema.getData)], controller.handleGetDataProduct);

router.route(`/${PRODUCT_PATH.GET_ALL}`).get(controller.handleGetAllData);

router
  .route(`/${PRODUCT_PATH.FILTER_BY_BRAND}`)
  .get(controller.handleFilterByBrand);

router.route(`/${PRODUCT_PATH.FILTER}`).get(controller.handleFilter);

router.route("/fliter-by-price").get(controller.handleFilterByPrice);

module.exports = router;
