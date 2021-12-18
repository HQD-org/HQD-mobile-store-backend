const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS, DISCOUNT_TYPE } = require("../Common/Constants");

const coupon = {
  name: DEFAULT_MODEL.stringRequire,
  image: DEFAULT_MODEL.stringRequire,
  quantity: DEFAULT_MODEL.number,
  discountBy: {
    ...DEFAULT_MODEL.stringRequire,
    default: DISCOUNT_TYPE.PERCENT,
  },
  minPriceToApply: DEFAULT_MODEL.number,
  discountValue: DEFAULT_MODEL.number,
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
  maxDiscount: DEFAULT_MODEL.number,
  startedDate: DEFAULT_MODEL.date,
  expiredDate: DEFAULT_MODEL.date,
  description: DEFAULT_MODEL.string,
};

module.exports = Coupon = mongoose.model("Coupon", createSchema(coupon));
