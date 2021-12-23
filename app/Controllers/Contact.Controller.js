const { sendError, sendSuccess } = require("./Controller");
const { sendContact } = require("../services/Contact.Service");

const handlerSendMailContact = async(req, res)=>{
    //const token = req.body.token;
  const result = await sendContact(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
}

module.exports={
    handlerSendMailContact
}