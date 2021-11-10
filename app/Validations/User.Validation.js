//create, update, getall, filter
const Joi = require("@hapi/joi");
const { REGEX } = require("../Common/Regex");


// name, phone email address [detail: DEFAULT_MODEL.string, village  district province] 
exports.schema={
    // validate các trường khi update profile user
    update: Joi.object().keys({ 
        name: Joi.string().regex(REGEX.UNICODE_LETTER),
        email: Joi.string().email(),
        phone: Joi.string().regex(REGEX.PHONE_VN),
        address: Joi.object({
            detail: Joi.string().regex(REGEX.UNICODE_STRING),
            village: Joi.string().regex(REGEX.UNICODE_STRING).required(),
            district: Joi.string().regex(REGEX.UNICODE_STRING).required(),
            province: Joi.string().regex(REGEX.UNICODE_STRING).required(),
          }),
    }),
    search: Joi.object().keys({
        name:Joi.string().regex(REGEX.UNICODE_LETTER),
    }),
};