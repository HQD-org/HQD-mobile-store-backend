const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, ROLE, AUTH_TYPE } = require("../Common/Constants");

const account = {
  username: DEFAULT_MODEL.stringRequire,
  password: DEFAULT_MODEL.stringPassword,
  role: { ...DEFAULT_MODEL.string, default: ROLE.USER },
  branch: DEFAULT_MODEL.string,
  isVerified: DEFAULT_MODEL.booleanFalse,
  otp: DEFAULT_MODEL.stringOtp,
  idUser: DEFAULT_MODEL.stringIdMongo,
  authType: { ...DEFAULT_MODEL.string, default: AUTH_TYPE.LOCAL },
  authGoogleID: DEFAULT_MODEL.string,
  authFacebookID: DEFAULT_MODEL.string,
};

module.exports = Account = mongoose.model("Account", createSchema(account));
