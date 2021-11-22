const { sendError, sendSuccess } = require("./Controller");
const {createProduct} = require("../Services/Product.Service")

const handleCreateProduct = async (req,res)=>{
    const result =  await createProduct(req.body);
    if (result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
}
module.exports={
    handleCreateProduct,
}