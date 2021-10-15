const { MOBILE_BRAND_PATH, PREFIX_PATH } = require("../Common/RoutePath");
const { FOLDER, ROLE } = require("../Common/Constants");
const controller = require("../Controllers/Admin.Controller");
const express = require("express");
const { schema } = require("../Validations/MobileBrand.Validation");
const { validateBody } = require("../Validations/Validation");
const { saveImage } = require("../Middlewares/File.Middleware");
const { isRole } = require("../Middlewares/Role.Middleware");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const router = express.Router();

// Mobile Brand
router
  .route(`/${PREFIX_PATH.MOBILE_BRAND}/${MOBILE_BRAND_PATH.CREATE}`)
  .post(
    [
      verifyToken,
      isRole([ROLE.ADMIN]),
      saveImage("image", FOLDER.MOBILE_BRAND),
      validateBody(schema.create),
    ],
    controller.handleCreateBrand
  );

router
  .route(`/${PREFIX_PATH.MOBILE_BRAND}/${MOBILE_BRAND_PATH.UPDATE}`)
  .post(
    [
      verifyToken,
      isRole([ROLE.ADMIN]),
      saveImage("image", FOLDER.MOBILE_BRAND),
      validateBody(schema.update),
    ],
    controller.handleUpdateBrand
  );

module.exports = router;
