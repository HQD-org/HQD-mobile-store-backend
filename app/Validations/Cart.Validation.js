const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");

exports.schema = {
  add: Joi.object().keys({
    idProduct: Joi.string().regex(REGEX.ID_MONGO).required(),
    color: Joi.string().required(),
    image: Joi.string().required(),
  }),
  update: Joi.object().keys({
    idProduct: Joi.string().regex(REGEX.ID_MONGO).required(),
    color: Joi.string().required(),
    quantity: Joi.number().required(),
  }),
  delete: Joi.object().keys({
    idProduct: Joi.string().regex(REGEX.ID_MONGO).required(),
    color: Joi.string().required(),
  }),
};
