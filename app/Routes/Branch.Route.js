

const express = require("express");
const router = express.Router();
const controller = require("../Controllers/Branch.Controller");
const { schema } = require("../Validations/Branch.Validation");
const { validateBody } = require("../Validations/Validation");
const {validateQuery} = require("../Validations/Validation");
const { ROLE } = require("../Common/Constants");
const { isRole } = require("../Middlewares/Role.Middleware");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const {
    BRANCH_PATH,
  } = require("../Common/RoutePath");
//router.route(`/${BRANCH_PATH.CREATE}`).post([verifyToken , isRole([ROLE.ADMIN]) ,validateBody(schema.create)],
router.route(`/${BRANCH_PATH.CREATE}`).post([verifyToken, isRole([ROLE.ADMIN]),validateBody(schema.create)],
controller.handleCreateBranch);
router.route(`/${BRANCH_PATH.GET_ALL}`).get(controller.handleGetAllBranch);
router.route(`/${BRANCH_PATH.UPDATE}`).post([verifyToken,isRole([ROLE.ADMIN]) ,validateBody(schema.update)],controller.handleUpdateBranch);
router.route(`/${BRANCH_PATH.FIND_BY_NAME}`).get(controller.handleSearchBranch);

module.exports=router;


//verifyToken , isRole([ROLE.ADMIN]) ,