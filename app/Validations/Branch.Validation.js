const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");
const { STATUS } = require("../Common/Constants");

exports.schema={
    create: Joi.object().keys({
        name: Joi.string().regex(REGEX.UNICODE_STRING).required(),
        address: Joi.object({
            detail: Joi.string().regex(REGEX.UNICODE_STRING),
            village: Joi.string().regex(REGEX.UNICODE_STRING).required(),
            district: Joi.string().regex(REGEX.UNICODE_STRING).required(),
            province: Joi.string().regex(REGEX.UNICODE_STRING).required(),
          }),
          token: Joi.object(),
          status: Joi.string().valid(
            STATUS.ACTIVE,
            STATUS.CLOSE,
            STATUS.BLOCK
          ),
    }),
    update: Joi.object().keys({
      name:Joi.string().regex(REGEX.UNICODE_STRING),
      id:Joi.string().regex(REGEX.ID_MONGO).required(),
      address: Joi.object({
        detail: Joi.string().regex(REGEX.UNICODE_STRING),
        village: Joi.string().regex(REGEX.UNICODE_STRING),
        district: Joi.string().regex(REGEX.UNICODE_STRING),
        province: Joi.string().regex(REGEX.UNICODE_STRING),
      }),
      status:Joi.string().valid(
        STATUS.ACTIVE,
        STATUS.CLOSE,
        STATUS.BLOCK),
      token: Joi.object(),
    }),
    search: Joi.object().keys({
      name:Joi.string().regex(REGEX.UNICODE_STRING),
    }),
};