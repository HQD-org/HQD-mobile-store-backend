const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");

module.exports.schema = {
  register: Joi.object().keys({
    name: Joi.string().regex(REGEX.UNICODE_LETTER).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().regex(REGEX.PHONE_VN).required(),
    password: Joi.string().regex(REGEX.PASSWORD).required(),
    address: Joi.object({
      detail: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      village: Joi.string().regex(REGEX.UNICODE_LETTER).required(),
      district: Joi.string().regex(REGEX.UNICODE_LETTER).required(),
      province: Joi.string().regex(REGEX.UNICODE_LETTER).required(),
    }),
  }),

  login: Joi.object().keys({
    username: Joi.string().email().required(),
    password: Joi.string().regex(REGEX.PASSWORD).required(),
  }),

  verify: Joi.object().keys({
    username: Joi.string().email().required(),
    otp: Joi.string().regex(REGEX.OTP).required(),
  }),

  forgotPassword: Joi.object().keys({
    email: Joi.string().email().required(),
  }),

  changePassword: Joi.object().keys({
    newPassword: Joi.string().regex(REGEX.PASSWORD).required(),
    oldPassword: Joi.string().regex(REGEX.PASSWORD).required(),
  }),
};
