const { MOBILE_BRAND_PATH } = require("../Common/RoutePath");
const controller = require("../Controllers/MobileBrand.Controller");
const express = require("express");
const { schema } = require("../Validations/MobileBrand.Validation");
const { validateBody, validateQuery } = require("../Validations/Validation");
const router = express.Router();

router
  .route(`/${MOBILE_BRAND_PATH.FIND_BY_NAME}`)
  .get(validateQuery(schema.search), controller.handleFindByName);

router
  .route(`/${MOBILE_BRAND_PATH.FILTER_BY_STATUS}`)
  .get(validateQuery(schema.search), controller.handleFilterByStatus);

router
  .route(`/${MOBILE_BRAND_PATH.GET_ALL}`)
  .get(validateQuery(schema.search), controller.handleGetAll);

module.exports = router;
