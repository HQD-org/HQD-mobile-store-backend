const { AUTH_PATH } = require("../Common/RoutePath");
const controller = require("../Controllers/Auth.Controller");
const express = require("express");
const { schema } = require("../Validations/Auth.Validation");
const { validateBody, validateParam } = require("../Validations/Validation");
const { verifyToken } = require("../Services/Token.Service");
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

router
  .route(`/${AUTH_PATH.FORGOT_PASSWORD}`)
  .post(validateBody(schema.forgotPassword), controller.handleForgotPassword);

router
  .route(`/${AUTH_PATH.CHANGE_PASSWORD}`)
  .post(
    validateBody(schema.changePassword),
    verifyToken,
    controller.handleChangePassword
  );

router
  .route(`/${AUTH_PATH.FORGOT_PASSWORD}/${AUTH_PATH.VERIFY}`)
  .post(validateBody(schema.verify), controller.handleSendNewPassword);

router
  .route(`/${AUTH_PATH.GET_AUTH}`)
  .get(verifyToken, controller.handleGetAuth);

module.exports = router;
