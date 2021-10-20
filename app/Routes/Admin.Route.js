const {
  MOBILE_BRAND_PATH,
  PREFIX_PATH,
  MOBILE_MODEL_PATH,
} = require("../Common/RoutePath");
const { FOLDER, ROLE } = require("../Common/Constants");
const controller = require("../Controllers/Admin.Controller");
const express = require("express");
const mobileBrandSchema =
  require("../Validations/MobileBrand.Validation").schema;
const mobileModelSchema =
  require("../Validations/MobileModel.Validation").schema;
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
      validateBody(mobileBrandSchema.create),
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
      validateBody(mobileBrandSchema.update),
    ],
    controller.handleUpdateBrand
  );

//Mobile Model
router
  .route(`/${PREFIX_PATH.MOBILE_MODEL}/${MOBILE_MODEL_PATH.CREATE}`)
  .post(
    [validateBody(mobileModelSchema.create), verifyToken, isRole([ROLE.ADMIN])],
    controller.handleCreateModel
  );

router
  .route(`/${PREFIX_PATH.MOBILE_MODEL}/${MOBILE_MODEL_PATH.UPDATE}`)
  .post(
    [validateBody(mobileModelSchema.update), verifyToken, isRole([ROLE.ADMIN])],
    controller.handleUpdateModel
  );

module.exports = router;
