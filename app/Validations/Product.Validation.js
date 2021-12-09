const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");
const { STATUS } = require("../Common/Constants");

exports.schema = {
  create: Joi.object().keys({
    name: Joi.string().regex(REGEX.UNICODE_STRING).required(),
    idModel: Joi.string().regex(REGEX.ID_MONGO).required(),
    capacity: Joi.string().required(),
    ram: Joi.string().required(),
    status: Joi.string().valid(
      STATUS.ACTIVE,
      STATUS.STOP_SELLING,
      STATUS.OUT_OF_STOCK
    ),
    color: Joi.array()
      .items(
        Joi.object()
          .keys({
            name: Joi.string().required(),
            price: Joi.number().required(),
            quantityInfo: Joi.array().items(
              Joi.object().keys({
                quantity: Joi.number().required(),
                idBranch: Joi.string().regex(REGEX.ID_MONGO).required(),
              })
            ),
          })
          .required()
      )
      .required(),
    description: Joi.string(),
  }),
  update: Joi.object().keys({
    id: Joi.string().regex(REGEX.ID_MONGO).required(),
    name: Joi.string(),
    idModel: Joi.string().regex(REGEX.ID_MONGO),
    capacity: Joi.string(),
    ram: Joi.string(),
    status: Joi.string().valid(
      STATUS.ACTIVE,
      STATUS.STOP_SELLING,
      STATUS.OUT_OF_STOCK
    ),
    color: Joi.array().items(
      Joi.object()
        .keys({
          name: Joi.string().required(),
          price: Joi.number().required(),
          quantityInfo: Joi.array().items(
            Joi.object().keys({
              quantity: Joi.number().required(),
              idBranch: Joi.string().regex(REGEX.ID_MONGO).required(),
            })
          ),
        })
        .required()
    ),
    description: Joi.string(),
  }),
  updateQuantity: Joi.object().keys({
    id: Joi.string().regex(REGEX.ID_MONGO).required(),
    color: Joi.array()
      .items(
        Joi.object()
          .keys({
            name: Joi.string().required(),
            quantity: Joi.number().required(),
          })
          .required()
      )
      .required(),
  }),
};
