
const { sendError, sendSuccess } = require("./Controller");
const {createBranch, getAllBranch, updateBranch, searchBranch} = require("../Services/Branch.Service");

const handleCreateBranch = async(req,res)=>{
    const result = await createBranch(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
}

const handleGetAllBranch =async(req,res)=>{
  const result = await getAllBranch();
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
}

const handleUpdateBranch =async(req,res)=>{
  const result = await updateBranch(req.body);
  if(result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
}
const handleSearchBranch = async(req,res)=>{
  const result = await searchBranch(req.query);
  if(result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
}

module.exports={
    handleCreateBranch,
    handleGetAllBranch,
    handleUpdateBranch,
    handleSearchBranch
}