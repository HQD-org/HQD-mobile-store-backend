const controller = require("../Controllers/Order.Controller");
const express = require("express");
const { ORDER_PATH } = require("../Common/RoutePath");
const { schema } = require("../Validations/Order.Validation");
const { validateQuery, validateBody } = require("../Validations/Validation");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const { ROLE } = require("../Common/Constants");
const { isRole } = require("../Middlewares/Role.Middleware");
const router = express.Router();

router
  .route(`/${ORDER_PATH.CREATE}`)
  .post([validateBody(schema.create), verifyToken], controller.handleCreate);

router
  .route(`/${ORDER_PATH.CHANGE_STATUS}`)
  .post(
    [
      validateBody(schema.changeStatus),
      verifyToken,
      isRole([ROLE.ADMIN, ROLE.MANAGER_BRANCH]),
    ],
    controller.handleChangeStatus
  );

router
  .route(`/${ORDER_PATH.CANCEL}`)
  .post([validateBody(schema.cancel), verifyToken], controller.handleCancel);

router
  .route(`/${ORDER_PATH.GET_BY_STATUS_AND_USER}`)
  .get(
    [validateQuery(schema.getByStatusAndUser), verifyToken],
    controller.handleGetByStatusAndUser
  );

router
  .route(`/${ORDER_PATH.GET_ALL_BY_USER}`)
  .get([verifyToken], controller.handleGetAllByUser);

module.exports = router;
