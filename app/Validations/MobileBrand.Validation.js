const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");
const { STATUS } = require("../Common/Constants");

module.exports.schema = {
  create: Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.string().valid(
      STATUS.ACTIVE,
      STATUS.STOP_SELLING,
      STATUS.OUT_OF_STOCK
    ),
  }),
  update: Joi.object().keys({
    id: Joi.string().regex(REGEX.ID_MONGO).required(),
    name: Joi.string(),
    status: Joi.string().valid(
      STATUS.ACTIVE,
      STATUS.STOP_SELLING,
      STATUS.OUT_OF_STOCK
    ),
  }),
  search: Joi.object().keys({
    page: Joi.number(),
    itemPerPage: Joi.number(),
    searchTerm: Joi.string(),
    status: Joi.string(),
  }),
};
