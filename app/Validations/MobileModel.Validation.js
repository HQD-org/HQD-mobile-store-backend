const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");
const { STATUS } = require("../Common/Constants");

exports.schema = {
  create: Joi.object().keys({
    name: Joi.string().required(),
    idBrand: Joi.string().regex(REGEX.ID_MONGO).required(),
    screen: Joi.string().required(),
    operation: Joi.string().required(),
    rearCamera: Joi.string().required(),
    frontCamera: Joi.string().required(),
    chip: Joi.string().required(),
    sim: Joi.string().required(),
    battery: Joi.string().required(),
    charger: Joi.string().required(),
    memoryStick: Joi.string(),
    timeDebut: Joi.string().required(),
    status: Joi.string().valid(
      STATUS.ACTIVE,
      STATUS.STOP_SELLING,
      STATUS.OUT_OF_STOCK
    ),
    description: Joi.string(),
  }),
  update: Joi.object().keys({
    id: Joi.string().regex(REGEX.ID_MONGO).required(),
    name: Joi.string(),
    idBrand: Joi.string().regex(REGEX.ID_MONGO),
    screen: Joi.string(),
    operation: Joi.string(),
    rearCamera: Joi.string(),
    frontCamera: Joi.string(),
    chip: Joi.string(),
    sim: Joi.string(),
    battery: Joi.string(),
    charger: Joi.string(),
    memoryStick: Joi.string(),
    timeDebut: Joi.string(),
    status: Joi.string().valid(
      STATUS.ACTIVE,
      STATUS.STOP_SELLING,
      STATUS.OUT_OF_STOCK
    ),
    description: Joi.string(),
  }),
  search: Joi.object().keys({
    page: Joi.number(),
    itemPerPage: Joi.number(),
    status: Joi.string(),
    name: Joi.string(),
    idBrand: Joi.string(),
    screen: Joi.string(),
    operation: Joi.string(),
    rearCamera: Joi.string(),
    frontCamera: Joi.string(),
    chip: Joi.string(),
    sim: Joi.string(),
    battery: Joi.string(),
    charger: Joi.string(),
    memoryStick: Joi.string(),
    timeDebut: Joi.string(),
    description: Joi.string(),
    brand: Joi.string(),
  }),
};
