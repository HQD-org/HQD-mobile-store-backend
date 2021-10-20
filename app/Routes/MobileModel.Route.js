const { MOBILE_MODEL_PATH } = require("../Common/RoutePath");
const controller = require("../Controllers/MobileModel.Controller");
const express = require("express");
const { schema } = require("../Validations/MobileModel.Validation");
const { validateQuery } = require("../Validations/Validation");
const router = express.Router();

router
  .route(`/${MOBILE_MODEL_PATH.FILTER}`)
  .get(validateQuery(schema.search), controller.handleFilter);

router
  .route(`/${MOBILE_MODEL_PATH.FIND_BY_NAME}`)
  .get(validateQuery(schema.search), controller.handleFindByName);

router
  .route(`/${MOBILE_MODEL_PATH.GET_ALL}`)
  .get(validateQuery(schema.search), controller.handleGetAll);

module.exports = router;
