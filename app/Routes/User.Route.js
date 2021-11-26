const { USER_PATH } = require("../Common/RoutePath");
const controller = require("../Controllers/User.Controller");
const express = require("express");
const { schema } = require("../Validations/User.Validation");
const { validateBody } = require("../Validations/Validation");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const router = express.Router();

router
  .route(`/${USER_PATH.UPDATE}`)
  .post(
    [validateBody(schema.updateProfile), verifyToken],
    controller.handleUpdateProfile
  );

module.exports = router;
