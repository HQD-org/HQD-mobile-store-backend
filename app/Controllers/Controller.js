const { HTTP_STATUS_CODE } = require("../Common/Constants");

const sendSuccess = (res, data = {}, message, status = HTTP_STATUS_CODE.OK) => {
  return res.status(status).json({
    message: message || "success",
    data: data,
  });
};

const sendError = (
  res,
  message,
  status = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
) => {
  return res.status(status).json({
    message: message || "Internal server error",
  });
};

module.exports = {
  sendError,
  sendSuccess,
};
