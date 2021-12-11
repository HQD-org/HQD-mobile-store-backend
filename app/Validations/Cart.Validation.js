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
  mergeCart: Joi.object().keys({
    products: Joi.array().items(
      Joi.object()
        .keys({
          idProduct: Joi.string().regex(REGEX.ID_MONGO).required(),
          color: Joi.string().required(),
          quantity: Joi.number().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
          image: Joi.string().required(),
        })
        .required()
    ),
  }),
};
