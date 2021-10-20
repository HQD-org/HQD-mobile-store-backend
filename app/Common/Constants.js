const { REGEX } = require("./Regex");

exports.AUTH_TYPE = {
  FACEBOOK: "facebook",
  GOOGLE: "google",
  LOCAL: "local",
};

exports.DEFAULT_MODEL = {
  date: { type: Date },
  string: { type: String, default: "" },
  stringRequire: { type: String, required: true },
  stringIdMongo: { type: String, match: REGEX.ID_MONGO },
  stringPhone: {
    type: String,
    required: true,
    unique: true,
    match: REGEX.PHONE_VN,
  },
  stringEmail: {
    type: String,
    required: true,
    unique: true,
    match: REGEX.EMAIL,
  },
  stringUnique: { type: String, required: true, unique: true },
  stringOtp: { type: String, default: "", match: REGEX.OTP },
  array: { type: Array, default: [] },
  number: { type: Number, default: 0 },
  boolean: { type: Boolean, default: true },
  booleanFalse: { type: Boolean, default: false },
  object: { type: {}, default: {} },
};

exports.FOLDER = {
  MOBILE_BRAND: "MobileBrand",
  MOBILE_MODEL: "MobileModel",
  PRODUCT: "Product",
};

exports.HTTP_STATUS_CODE = {
  CREATE: 201,
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  UNPROCESSABLE_ENTITY: 422,
};

exports.RECEIVE_TYPE = {
  STORE: "at store",
  HOME: "at home",
};

exports.ROLE = {
  ADMIN: "admin",
  MANAGER_BRANCH: "manager branch",
  USER: "user",
  GUEST: "guest",
};

exports.STATUS = {
  ACTIVE: "active",
  BLOCK: "block",
  CANCEL: "cancel",
  CLOSE: "close",
  DONE: "done",
  EXPIRED: "expired",
  OPEN: "open",
  OUT_OF_STOCK: "out of stock",
  STOP_SELLING: "stop selling",
  PAID: "paid",
  REFUND: "refund",
  UNPAID: "unpaid",
  WAIT: "wait",
};
