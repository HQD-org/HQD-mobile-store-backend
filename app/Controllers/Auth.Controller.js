const { encodedToken } = require("../Services/Token.Service");
const { sendError, sendSuccess } = require("./Controller");
const {
  changePassword,
  forgotPassword,
  getAuth,
  login,
  register,
  sendNewPassword,
  verifyAccount,
} = require("../Services/Auth.Service");

const handleChangePassword = async (req, res) => {
  const { token, oldPassword, newPassword } = req.body;
  const result = await changePassword(token.id, oldPassword, newPassword);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const result = await forgotPassword(email);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetAuth = async (req, res) => {
  const token = req.body.token;
  const result = await getAuth(token.id);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const result = await login(username, password);
  if (result.success) {
    const accessToken = encodedToken(result.data.idUser);
    const role = result.data.role;
    res.setHeader("Authorization", accessToken);
    return sendSuccess(
      res,
      { accessToken: accessToken, role: role },
      result.message,
      result.status
    );
  }
  return sendError(res, result.message, result.status);
};

const handleRegister = async (req, res) => {
  const result = await register(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleSendNewPassword = async (req, res) => {
  const { username, otp } = req.body;
  const result = await sendNewPassword(username, otp);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleVerifyAccount = async (req, res) => {
  const { username, otp } = req.body;
  const result = await verifyAccount(username, otp);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

module.exports = {
  handleChangePassword,
  handleForgotPassword,
  handleGetAuth,
  handleLogin,
  handleRegister,
  handleSendNewPassword,
  handleVerifyAccount,
};
