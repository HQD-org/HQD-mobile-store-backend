exports.HTTP_STATUS_CODE = {
  CREATE: 201,
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  UNPROCESSABLE_ENTITY: 422,
};

exports.DEFAULT_MODEL = {
  date: { type: Date },
  string: { type: String, default: "" },
  stringRequire: { type: String, required: true },
  stringIdMongo: { type: String, match: /^[a-f\d]{24}$/i },
  stringPhone: { type: String, required: true, match: /^0\d{9}$/ },
  stringEmail: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  },
  stringUnique: { type: String, required: true, unique: true },
  stringOtp: { type: String, default: "", match: /^\d{6}$/ },
  stringPassword: {
    type: String,
    required: true,
    match:
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
  },
  array: { type: Array, default: [] },
  number: { type: Number, default: 0 },
  boolean: { type: Boolean, default: true },
  booleanFalse: { type: Boolean, default: false },
  object: { type: Object, default: {} },
};

exports.ROLE = {
  ADMIN: "admin",
  USER: "user",
};

exports.AUTH_TYPE = {
  FACEBOOK: "facebook",
  GOOGLE: "google",
  LOCAL: "local",
};

exports.STATUS_COUPON = {
  ACTIVE: "active",
  EXPIRED: "expired",
  OUT_OF_STOCK: "out of stock",
};

exports.RECEIVE_TYPE = {
  STORE: "at store",
  HOME: "at home",
};
