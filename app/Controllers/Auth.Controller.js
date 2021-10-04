const { sendError, sendSuccess } = require("./Controller");
const { login, register, verifyAccount } = require("../Services/Auth.Service");
const { encodedToken } = require("../Services/Token.Service");

const handleLogin = async (req, res) => {
  const result = await login(req.body);
  console.log(result);
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

const handleVerifyAccount = async (req, res) => {
  const result = await verifyAccount(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

module.exports = {
  handleLogin,
  handleRegister,
  handleVerifyAccount,
};
