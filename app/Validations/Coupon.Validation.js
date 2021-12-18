const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");
const { STATUS, DISCOUNT_TYPE } = require("../Common/Constants");

exports.schema = {
  create: Joi.object().keys({
    name: Joi.string().regex(REGEX.UNICODE_STRING).required(),
    status: Joi.string()
      .valid(STATUS.ACTIVE, STATUS.EXPIRED, STATUS.OUT_OF_STOCK)
      .required(),
    quantity: Joi.number().required(),
    image: Joi.string().required(),
    discountBy: Joi.string()
      .valid(DISCOUNT_TYPE.PERCENT, DISCOUNT_TYPE.AMOUNT)
      .required(),
    minPriceToApply: Joi.number().required(),
    discountValue: Joi.number().required(),
    maxDiscount: Joi.number().required(),
    expiredDate: Joi.date().required(),
    startedDate: Joi.date().required(),
    description: Joi.string(),
  }),
  update: Joi.object().keys({
    id: Joi.string().regex(REGEX.ID_MONGO).required(),
    status: Joi.string().valid(
      STATUS.ACTIVE,
      STATUS.EXPIRED,
      STATUS.OUT_OF_STOCK
    ),
    image: Joi.string(),
    discountBy: Joi.string().valid(DISCOUNT_TYPE.PERCENT, DISCOUNT_TYPE.AMOUNT),
    minPriceToApply: Joi.number(),
    discountValue: Joi.number(),
    expiryDate: Joi.date(),
    description: Joi.string(),
  }),
  use: Joi.object().keys({
    id: Joi.string().regex(REGEX.ID_MONGO).required(),
  }),
};
