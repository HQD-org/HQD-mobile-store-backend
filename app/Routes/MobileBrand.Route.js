const { MOBILE_BRAND_PATH } = require("../Common/RoutePath");
const controller = require("../Controllers/MobileBrand.Controller");
const express = require("express");
const { schema } = require("../Validations/MobileBrand.Validation");
const { validateQuery } = require("../Validations/Validation");
const router = express.Router();

router
  .route(`/${MOBILE_BRAND_PATH.FILTER}`)
  .get([validateQuery(schema.search)], controller.handleFilter);

router.route(`/${MOBILE_BRAND_PATH.GET_ALL}`).get(controller.handleGetAll);
router.route('/get-all-active').get(controller.handleGetAllActive);

module.exports = router;
