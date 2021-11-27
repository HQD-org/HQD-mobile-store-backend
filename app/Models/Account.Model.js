const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const {
  DEFAULT_MODEL,
  ROLE,
  AUTH_TYPE,
  STATUS,
} = require("../Common/Constants");
const Schema = mongoose.Schema;

const account = {
  username: DEFAULT_MODEL.stringUnique,
  password: DEFAULT_MODEL.stringRequire,
  role: { ...DEFAULT_MODEL.stringRequire, default: ROLE.USER },
  isVerified: DEFAULT_MODEL.booleanFalse,
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
  otp: DEFAULT_MODEL.stringOtp,
  idUser: { type: Schema.Types.ObjectId, ref: "User" },
  authType: { ...DEFAULT_MODEL.string, default: AUTH_TYPE.LOCAL },
  authGoogleID: DEFAULT_MODEL.string,
  authFacebookID: DEFAULT_MODEL.string,
};

module.exports = Account = mongoose.model("Account", createSchema(account));
