const controller = require("../Controllers/Cart.Controller");
const express = require("express");
const { CART_PATH } = require("../Common/RoutePath");
const { schema } = require("../Validations/Cart.Validation");
const { validateBody } = require("../Validations/Validation");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const router = express.Router();

router
  .route(`/${CART_PATH.ADD_TO_CART}`)
  .post([validateBody(schema.add), verifyToken], controller.handleAddToCart);

router
  .route(`/${CART_PATH.UPDATE_CART}`)
  .post(
    [validateBody(schema.update), verifyToken],
    controller.handleUpdateCart
  );

router
  .route(`/${CART_PATH.DELETE_CART}`)
  .post(
    [validateBody(schema.delete), verifyToken],
    controller.handleDeleteProductInCart
  );

router
  .route(`/${CART_PATH.GET_PRODUCT_CART}`)
  .get([verifyToken], controller.handleGetProductInCart);

router
  .route(`/${CART_PATH.GET_CART}`)
  .get([verifyToken], controller.handleGetCart);

module.exports = router;
