const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");
const { ROLE, STATUS } = require("../Common/Constants");

exports.schema = {
  create: Joi.object().keys({
    name: Joi.string().required().regex(REGEX.UNICODE_LETTER),
    phone: Joi.string().required().regex(REGEX.PHONE_VN),
    email: Joi.string().email().required(),
    address: Joi.object().keys({
      detail: Joi.string().regex(REGEX.UNICODE_STRING),
      village: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      district: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      province: Joi.string().regex(REGEX.UNICODE_STRING).required(),
    }),
    password: Joi.string().required().regex(REGEX.PASSWORD),
    role: Joi.string()
      .valid(ROLE.ADMIN, ROLE.USER, ROLE.MANAGER_BRANCH)
      .required(),
    idBranch: Joi.string().regex(REGEX.ID_MONGO),
    status: Joi.string().valid(STATUS.ACTIVE, STATUS.BLOCK),
  }),
  updateProfile: Joi.object().keys({
    name: Joi.string().regex(REGEX.UNICODE_LETTER),
    phone: Joi.string().regex(REGEX.PHONE_VN),
    address: Joi.object({
      detail: Joi.string().regex(REGEX.UNICODE_STRING),
      village: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      district: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      province: Joi.string().regex(REGEX.UNICODE_STRING).required(),
    }),
  }),
  update: Joi.object().keys({
    idUser: Joi.string().regex(REGEX.ID_MONGO).required(),
    name: Joi.string().regex(REGEX.UNICODE_LETTER),
    phone: Joi.string().regex(REGEX.PHONE_VN),
    address: Joi.object({
      detail: Joi.string().regex(REGEX.UNICODE_STRING),
      village: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      district: Joi.string().regex(REGEX.UNICODE_STRING).required(),
      province: Joi.string().regex(REGEX.UNICODE_STRING).required(),
    }),
    password: Joi.string().regex(REGEX.PASSWORD),
    role: Joi.string().valid(ROLE.ADMIN, ROLE.USER, ROLE.MANAGER_BRANCH),
    idBranch: Joi.string().regex(REGEX.ID_MONGO),
    status: Joi.string().valid(STATUS.ACTIVE, STATUS.BLOCK),
  }),
  search: Joi.object().keys({
    page: Joi.number(),
    itemPerPage: Joi.number(),
    status: Joi.string(),
    name: Joi.string(),
    phone: Joi.string(),
    email: Joi.string(),
    role: Joi.string(),
    idBranch: Joi.string(),
    option: Joi.alternatives().try(Joi.array(), Joi.string()),
    sortBy: Joi.string(),
    ascSort: Joi.string(),
  }),
};
