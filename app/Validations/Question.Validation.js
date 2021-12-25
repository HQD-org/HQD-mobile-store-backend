const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");
const { STATUS } = require("../Common/Constants");

module.exports.schema = {
  search: Joi.object().keys({
    page: Joi.number(),
    itemPerPage: Joi.number(),
    questionSentence: Joi.string(),
    status: Joi.string(),
  }),
};
