const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const coupon = {
  name: DEFAULT_MODEL.stringRequire,
  image: DEFAULT_MODEL.stringRequire,
  quantity: DEFAULT_MODEL.number,
  discountByAmount: DEFAULT_MODEL.boolean,
  discountByPercent: DEFAULT_MODEL.booleanFalse,
  discountAmount: DEFAULT_MODEL.number,
  discountPercent: DEFAULT_MODEL.number,
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
  expiredDate: DEFAULT_MODEL.stringRequire,
  description: DEFAULT_MODEL.string,
};

module.exports = Coupon = mongoose.model("Coupon", createSchema(coupon));
