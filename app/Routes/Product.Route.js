
const {PRODUCT_PATH}= require("../Common/RoutePath");
const contronller = require("../Controllers/Product.Controller");
const express = require("express");
const {schema} = require("../Validations/Product.Validation");
const {validateQuery,validateBody} = require("../Validations/Validation");
const { isRole } = require("../Middlewares/Role.Middleware");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const { ROLE } = require("../Common/Constants");
const router = express.Router();
router.route(`/${PRODUCT_PATH.CREATE}`).post([verifyToken,isRole(ROLE.ADMIN),validateBody(schema.create)],
contronller.handleCreateProduct);
router.route(`/${PRODUCT_PATH.UPDATE}`).post([verifyToken,isRole(ROLE.ADMIN),validateBody(schema.update)],
contronller.handleUpdateProduct);
router.route(`/${PRODUCT_PATH.GETDATA}`).get([validateQuery(schema.getData)],contronller.handleGetDataProduct);
router.route(`/${PRODUCT_PATH.GET_ALL}`).get(contronller.handleGetAllData);
router.route(`/${PRODUCT_PATH.FILTER_BY_BRAND}`).get(contronller.handleFilterByBrand);
router.route(`/${PRODUCT_PATH.FILTER}`).get(contronller.handleFilter);
router.route('/fliter-by-price').get(contronller.handleFilterByPrice);
module.exports=router;
