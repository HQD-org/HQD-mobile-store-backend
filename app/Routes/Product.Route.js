
const {PRODUCT_PATH}= require("../Common/RoutePath");
const controller = require("../Controllers/Product.Controller");
const express = require("express");
const {schema} = require("../Validations/Product.Validation");
const {validateBody} = require("../Validations/Validation");
const { isRole } = require("../Middlewares/Role.Middleware");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const { ROLE } = require("../Common/Constants");
const router = express.Router();
router.route(`/${PRODUCT_PATH.CREATE}`).post([verifyToken,isRole(ROLE.ADMIN),validateBody(schema.create)],
controller.handleCreateProduct);

module.exports=router;
