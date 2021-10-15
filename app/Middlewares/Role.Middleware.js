const { HTTP_STATUS_CODE } = require("../Common/Constants");

const isRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      const account = await Account.findOne({ idUser: req.body.token.id });
      if (!account)
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          message: "User not found",
          access: false,
        });
      if (!roles.includes(account.role))
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
          message: "You don't have permission",
          access: false,
        });
      next();
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
        access: false,
      });
    }
  };
};

module.exports = {
  isRole,
};
