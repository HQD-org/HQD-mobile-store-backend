const { sendError, sendSuccess } = require("./Controller");
const { updateProfileUser } = require("../Services/User.Service");

const handleUpdateProfile = async (req, res) => {
  const token = req.body.token;
  const result = await updateProfileUser(token.id, req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

module.exports = {
  handleUpdateProfile,
};
