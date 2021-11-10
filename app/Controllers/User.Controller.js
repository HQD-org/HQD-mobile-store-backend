const { encodedToken } = require("../Middlewares/Token.Middleware");
const { sendError, sendSuccess } = require("./Controller");
const {
    updateUser,
    findAllUser,
    searchByName,
} = require("../Services/User.Service");

const handleUpdate = async(req, res)=>{
    const token = req.body.token;
    const result = await updateUser(token.id,req.body);
    if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleFindAllUser = async(req,res)=>{
    const result = await findAllUser();
    if(result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
} 

const handleSearchUserByName = async(req,res)=>{
    const result = await searchByName(req.query);
    if(result.success)
        return sendSuccess(res, result.data, result.message, result.status);
    return sendError(res, result.message, result.status);
} 

module.exports = {
    handleUpdate,
    handleFindAllUser,
    handleSearchUserByName,
  };