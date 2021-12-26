const express = require("express");
const router = express.Router();
const controller = require("../Controllers/Branch.Controller");
const { schema } = require("../Validations/Branch.Validation");
const { validateBody } = require("../Validations/Validation");
const { validateQuery } = require("../Validations/Validation");
const { ROLE } = require("../Common/Constants");
const { isRole } = require("../Middlewares/Role.Middleware");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const { BRANCH_PATH } = require("../Common/RoutePath");

router
  .route(`/${BRANCH_PATH.CREATE}`)
  .post(
    [validateBody(schema.create), verifyToken, isRole([ROLE.ADMIN])],
    controller.handleCreateBranch
  );

router.route(`/${BRANCH_PATH.GET_ALL}`).get(controller.handleGetAllBranch);

router
  .route(`/${BRANCH_PATH.UPDATE}`)
  .post(
    [validateBody(schema.update), verifyToken, isRole([ROLE.ADMIN])],
    controller.handleUpdateBranch
  );

router.route(`/${BRANCH_PATH.FILTER}`).get(controller.handleSearchBranch);

router
  .route(`/${BRANCH_PATH.GET_BY_LIST_ID}`)
  .get(controller.handleGetByListId);

router
  .route(`/${BRANCH_PATH.GET_ALL_OPEN}`)
  .get(controller.handleGetAllBranchOpen);

module.exports = router;
