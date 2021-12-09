const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");
const { STATUS, RECEIVE_TYPE } = require("../Common/Constants");

exports.schema = {
  create: Joi.object().keys({
    products: Joi.array()
      .items(
        Joi.object()
          .keys({
            idProduct: Joi.string().regex(REGEX.ID_MONGO).required(),
            quantity: Joi.number().required(),
            color: Joi.string().required(),
            image: Joi.string().required(),
            price: Joi.number().required(),
          })
          .required()
      )
      .required(),
    idBranch: Joi.string().regex(REGEX.ID_MONGO),
    totalPrice: Joi.number().required(),
    coupon: Joi.string(),
    receiveInfo: Joi.object()
      .keys({
        receiver: Joi.string().regex(REGEX.UNICODE_STRING).required(),
        phone: Joi.string().regex(REGEX.PHONE_VN).required(),
        address: Joi.string().required(),
        receiveAt: Joi.string().valid(RECEIVE_TYPE.HOME, RECEIVE_TYPE.STORE),
        timeReceive: Joi.string().valid(
          RECEIVE_TYPE.ALL_DAY,
          RECEIVE_TYPE.OFFICE_DAY
        ),
        message: Joi.string(),
      })
      .required(),
  }),
  changeStatus: Joi.object().keys({
    idOrder: Joi.string().regex(REGEX.ID_MONGO).required(),
    status: Joi.string().valid(
      STATUS.CONFIRMED,
      STATUS.CANCEL,
      STATUS.DELIVERING,
      STATUS.DELIVERED
    ),
  }),
  cancel: Joi.object().keys({
    idOrder: Joi.string().regex(REGEX.ID_MONGO).required(),
  }),
  getByStatusAndUser: Joi.object().keys({
    status: Joi.string().valid(
      STATUS.CONFIRMED,
      STATUS.DELIVERING,
      STATUS.DELIVERED,
      STATUS.WAIT,
      STATUS.CANCEL
    ),
    page: Joi.number(),
    itemPerPage: Joi.number(),
  }),
};
