
const { sendError, sendSuccess } = require("./Controller");
const {craeteOrder, changeStatusOrder, deleteOrder, getDataOrder} = require("../Services/Order.Service");

const handleCreateOrder = async (req, res)=>{
    const token = req.body.token.id;
    const result =  await craeteOrder(token,req.body);
    if (result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
}
const handleChangeStatusOrder = async(req,res)=>{
   
    const result =  await changeStatusOrder(req.body);
    if (result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
}

const handleDeleteOrder = async(req,res)=>{
    const token = req.body.token.id;
    const result =  await deleteOrder(token,req.body);
    if (result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
}
const handleGetDataOrder = async(req,res)=>{
    const token = req.body.token.id;
    const result =  await getDataOrder(token,req.query);
    if (result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
}
module.exports = {
    handleCreateOrder,
    handleChangeStatusOrder,
    handleDeleteOrder,
    handleGetDataOrder
}