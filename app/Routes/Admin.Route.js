const {
  MOBILE_BRAND_PATH,
  PREFIX_PATH,
  MOBILE_MODEL_PATH,
  USER_PATH,
} = require("../Common/RoutePath");
const { ROLE } = require("../Common/Constants");
const controller = require("../Controllers/Admin.Controller");
const express = require("express");
const mobileBrandSchema =
  require("../Validations/MobileBrand.Validation").schema;
const mobileModelSchema =
  require("../Validations/MobileModel.Validation").schema;
const userSchema = require("../Validations/User.Validation").schema;
const { validateBody, validateQuery } = require("../Validations/Validation");
const { isRole } = require("../Middlewares/Role.Middleware");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const router = express.Router();

// Mobile Brand
router
  .route(`/${PREFIX_PATH.MOBILE_BRAND}/${MOBILE_BRAND_PATH.CREATE}`)
  .post(
    [verifyToken, isRole([ROLE.ADMIN]), validateBody(mobileBrandSchema.create)],
    controller.handleCreateBrand
  );

router
  .route(`/${PREFIX_PATH.MOBILE_BRAND}/${MOBILE_BRAND_PATH.UPDATE}`)
  .post(
    [verifyToken, isRole([ROLE.ADMIN]), validateBody(mobileBrandSchema.update)],
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

// User
router
  .route(`/${PREFIX_PATH.USER}/${USER_PATH.CREATE}`)
  .post(
    [validateBody(userSchema.create), verifyToken, isRole([ROLE.ADMIN])],
    controller.handleCreateUser
  );

router
  .route(`/${PREFIX_PATH.USER}/${USER_PATH.FILTER}`)
  .get(
    [validateQuery(userSchema.search), verifyToken, isRole([ROLE.ADMIN])],
    controller.handleFilterUser
  );

router
  .route(`/${PREFIX_PATH.USER}/${USER_PATH.GET_ALL}`)
  .get([verifyToken, isRole([ROLE.ADMIN])], controller.handleGetAllUser);

router
  .route(`/${PREFIX_PATH.USER}/${USER_PATH.UPDATE}`)
  .post(
    [validateBody(userSchema.update), verifyToken, isRole([ROLE.ADMIN])],
    controller.handleUpdateUser
  );

router
  .route(`/${PREFIX_PATH.USER}/${USER_PATH.GET_ALL_MANAGER_BRANCH}`)
  .get(
    [verifyToken, isRole([ROLE.ADMIN])],
    controller.handleGetAllManagerBranch
  );

module.exports = router;
