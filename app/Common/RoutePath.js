exports.AUTH_PATH = {
  CHANGE_PASSWORD: "change-password",
  FORGOT_PASSWORD: "forgot-password",
  GET_AUTH: "get-auth",
  LOGIN: "login",
  REGISTER: "register",
  VERIFY: "verify",
};

exports.BRANCH_PATH = {
  CREATE: "create",
  // DELETE: "delete",
  FILTER: "filter",
  GET_ALL: "get-all",
  UPDATE: "update",
  GET_BY_LIST_ID: "get-by-list-id",
  GET_ALL_OPEN: "get-all-open",
};

exports.CART_PATH = {
  ADD_TO_CART: "add-to-cart",
  DELETE_CART: "delete-cart",
  GET_PRODUCT_CART: "get-product-cart",
  UPDATE_CART: "update-cart",
  UPDATE_CART_GUEST: "update-cart-guest",
  GET_CART: "get-cart",
  MERGE_CART: "merge-cart",
};

exports.MOBILE_BRAND_PATH = {
  CREATE: "create",
  // DELETE: "delete",
  FILTER: "filter",
  GET_ALL: "get-all",
  UPDATE: "update",
};

exports.MOBILE_MODEL_PATH = {
  CREATE: "create",
  // DELETE: "delete",
  FILTER: "filter",
  GET_ALL: "get-all",
  UPDATE: "update",
};

exports.ORDER_PATH = {
  CREATE: "create",
  CREATE_GUEST: "create-guest",
  GET_BY_STATUS_AND_USER: "get-by-status-and-user",
  GET_ALL_BY_USER: "get-all-by-user",
  CANCEL: "cancel",
  CHANGE_STATUS: "change-status",
  GET_BY_STATUS_AND_BRANCH: "get-by-status-and-branch",
  FILTER_BY_BRANCH: "filter-by-branch",
  GET_PROFIT_BY_YEAR: "get-profit-by-year",
  GET_TOP_10_BEST_SELLER_PRODUCT: "get-top-10-best-seller-product",
};

exports.PREFIX_PATH = {
  ADMIN: "admin",
  AUTH: "auth",
  CART: "cart",
  COUPON: "coupon",
  BRANCH: "branch",
  MOBILE_BRAND: "mobile-brand",
  MOBILE_MODEL: "mobile-model",
  ORDER: "order",
  PRODUCT: "product",
  USER: "user",
};

exports.PRODUCT_PATH = {
  CREATE: "create",
  FIND_BY_ID: "find-by-id",
  UPDATE_QUANTITY: "update-quantity",
  GET_ALL: "get-all",
  UPDATE: "update",
  FILTER: "filter",
  GET_GROUP_BY_BRAND: "get-group-by-brand",
};

exports.USER_PATH = {
  CREATE: "create",
  FILTER: "filter",
  GET_ALL: "get-all",
  UPDATE: "update",
  GET_ALL_MANAGER_BRANCH: "get-all-manager-branch",
};

exports.COUPON_PATH = {
  CREATE: "create",
  FILTER: "filter",
  GET_ALL: "get-all",
  UPDATE: "update",
  USE: "use",
  GENERATE_NAME: "generate-name",
  FINDBYNAME: "find-by-name",
  APPLY: "apply",
};
