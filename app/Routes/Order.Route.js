const contronller = require("../Controllers/Order.Controller");
const express = require("express");
const {schema} = require("../Validations/Order.Validation");
const {validateQuery,validateBody} = require("../Validations/Validation");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const { ROLE } = require("../Common/Constants");
const { isRole } = require("../Middlewares/Role.Middleware");
const router = express.Router();


router.route('/create-order').post([ verifyToken],contronller.handleCreateOrder); //validateBody(schema.create),
router.route('/change-status-order').post([verifyToken, isRole(ROLE.ADMIN), validateBody(schema.changeStatus)],
contronller.handleChangeStatusOrder);
router.route('/delete-order').post([verifyToken],contronller.handleDeleteOrder);
router.route('/get-order').get([verifyToken],contronller.handleGetDataOrder);
module.exports=router;