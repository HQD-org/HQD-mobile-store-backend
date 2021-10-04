const { AUTH_PATH } = require("../Common/RoutePath");
const controller = require("../Controllers/Auth.Controller");
const express = require("express");
const { schema } = require("../Validations/Auth.Validation");
const { validateBody, validateParam } = require("../Validations/Validation");
const router = express.Router();

router
  .route(`/${AUTH_PATH.REGISTER}`)
  .post(validateBody(schema.register), controller.handleRegister);

router
  .route(`/${AUTH_PATH.LOGIN}`)
  .post(validateBody(schema.login), controller.handleLogin);

router
  .route(`/${AUTH_PATH.VERIFY}`)
  .post(validateBody(schema.verify), controller.handleVerifyAccount);
module.exports = router;
