const contronller = require("../Controllers/Cart.Controller");
const express = require("express");
const {schema} = require("../Validations/Product.Validation");
const {validateQuery,validateBody} = require("../Validations/Validation");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const router = express.Router();


router.route('/add-to-cart').post([verifyToken],contronller.handleAddToCart);
router.route('/update-cart').post([verifyToken],contronller.handleUpdateCart);
router.route('/delete-cart').post([verifyToken],contronller.handleDeleteProductInCart);
router.route('/get-product-cart').get([verifyToken],contronller.handleGetProductInCart);
module.exports=router;