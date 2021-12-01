const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");

exports.schema={
    create:Joi.object().keys({
        //idCart:Joi.string().regex(REGEX.ID_MONGO).required(),
        products: Joi.array().items(Joi.object().keys({
            idProduct:Joi.string().regex(REGEX.ID_MONGO).required(),
            quantity:Joi.number().required(),
            color:Joi.string().required(),
            image:Joi.string().required(),
        }).required(),
        ).required(),
        totalPrice: Joi.number().required(),
        coupon: Joi.string(),
        user: Joi.string().regex(REGEX.ID_MONGO).required(),
        receiveInfo: Joi.object().keys({
            receiver: Joi.string().regex(REGEX.UNICODE_STRING).required(),
            phone:Joi.string().regex(REGEX.PHONE_VN).required(),
            address: Joi.string().regex(REGEX.UNICODE_STRING).required(),
            receiveAt: Joi.string().regex(REGEX.UNICODE_STRING).required(),
            timeReceive: Joi.string(),
            status: Joi.string().required(),
            message: Joi.string(),
        }).required(),
         status: Joi.string().regex(REGEX.UNICODE_STRING).required(),
        // token:Joi.string().regex(REGEX.ID_MONGO).required(),
    }),
    changeStatus: Joi.object().keys({
        idOrder:Joi.string().regex(REGEX.ID_MONGO).required(),
        status:Joi.string(),
        token: Joi.object(),
    }),
}