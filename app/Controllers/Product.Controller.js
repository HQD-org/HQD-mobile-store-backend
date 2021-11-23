const { sendError, sendSuccess } = require("./Controller");
const {createProduct,updateProduct,getDataProduct,getAllData,filterByBrand} = require("../Services/Product.Service")

const handleCreateProduct = async (req,res)=>{
    const result =  await createProduct(req.body);
    if (result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
}

const handleUpdateProduct = async(req,res)=>{
    const result = await updateProduct(req.body);
    if (result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
}

const handleGetDataProduct = async (req,res)=>{
    const result = await getDataProduct(req.query);
    if (result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
}
const handleGetAllData = async (req,res)=>{
    const result = await getAllData();
    if (result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
}

const handleFilterByBrand = async(req,res)=>{
    const result = await filterByBrand(req.query);
    if (result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
}
module.exports={
    handleCreateProduct,
    handleUpdateProduct,
    handleGetDataProduct,
    handleGetAllData,
    handleFilterByBrand
}