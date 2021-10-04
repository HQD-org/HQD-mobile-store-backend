const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const {
  DEFAULT_MODEL,
  ROLE,
  AUTH_TYPE,
  STATUS,
} = require("../Common/Constants");

const account = {
  username: DEFAULT_MODEL.stringUnique,
  password: DEFAULT_MODEL.stringPassword,
  role: { ...DEFAULT_MODEL.stringRequire, default: ROLE.USER },
  idBranch: DEFAULT_MODEL.stringIdMongo,
  isVerified: DEFAULT_MODEL.booleanFalse,
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
  otp: DEFAULT_MODEL.stringOtp,
  idUser: DEFAULT_MODEL.stringIdMongo,
  authType: { ...DEFAULT_MODEL.string, default: AUTH_TYPE.LOCAL },
  authGoogleID: DEFAULT_MODEL.string,
  authFacebookID: DEFAULT_MODEL.string,
};

module.exports = Account = mongoose.model("Account", createSchema(account));
