const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");

module.exports.schema = {
  register: Joi.object().keys({
    name: Joi.string().regex(REGEX.UNICODE_LETTER).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().regex(REGEX.PHONE_VN).required(),
    password: Joi.string().regex(REGEX.PASSWORD).required(),
    address: Joi.object({
      detail: Joi.string().regex(REGEX.UNICODE_STRING),
      village: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      district: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      province: Joi.string().regex(REGEX.UNICODE_STRING).required(),
    }),
  }),

  login: Joi.object().keys({
    username: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  verify: Joi.object().keys({
    username: Joi.string().email().required(),
    otp: Joi.string().regex(REGEX.OTP).required(),
  }),

  forgotPassword: Joi.object().keys({
    username: Joi.string().email().required(),
  }),

  changePassword: Joi.object().keys({
    newPassword: Joi.string().regex(REGEX.PASSWORD).required(),
    oldPassword: Joi.string().regex(REGEX.PASSWORD).required(),
  }),
};
