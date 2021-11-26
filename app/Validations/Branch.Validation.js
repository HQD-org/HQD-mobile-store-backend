const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");
const { STATUS } = require("../Common/Constants");

exports.schema = {
  create: Joi.object().keys({
    name: Joi.string().regex(REGEX.UNICODE_STRING).required(),
    address: Joi.object({
      detail: Joi.string().regex(REGEX.UNICODE_STRING),
      village: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      district: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      province: Joi.string().regex(REGEX.UNICODE_STRING).required(),
    }).required(),
    status: Joi.string().valid(STATUS.OPEN, STATUS.CLOSE),
    idManager: Joi.string().regex(REGEX.ID_MONGO).required(),
  }),
  update: Joi.object().keys({
    name: Joi.string().regex(REGEX.UNICODE_STRING),
    id: Joi.string().regex(REGEX.ID_MONGO).required(),
    address: Joi.object({
      detail: Joi.string().regex(REGEX.UNICODE_STRING),
      village: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      district: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      province: Joi.string().regex(REGEX.UNICODE_STRING).required(),
    }),
    idManager: Joi.string().regex(REGEX.ID_MONGO),
    status: Joi.string().valid(STATUS.OPEN, STATUS.CLOSE),
  }),
  search: Joi.object().keys({
    name: Joi.string().regex(REGEX.UNICODE_STRING),
  }),
};
