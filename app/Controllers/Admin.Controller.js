const { createBrand, updateBrand } = require("../Services/MobileBrand.Service");
const { createModel, updateModel } = require("../Services/MobileModel.Service");
const {
  createUser,
  filterUser,
  getAllUser,
  updateUser,
  getAllManagerBranchNoPosition,
} = require("../Services/User.Service");
const { sendError, sendSuccess } = require("./Controller");

// Mobile Brand
const handleCreateBrand = async (req, res) => {
  const result = await createBrand(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleUpdateBrand = async (req, res) => {
  const result = await updateBrand(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

//Mobile Model
const handleCreateModel = async (req, res) => {
  const result = await createModel(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleUpdateModel = async (req, res) => {
  const result = await updateModel(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

//User
const handleCreateUser = async (req, res) => {
  const result = await createUser(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleFilterUser = async (req, res) => {
  const result = await filterUser(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetAllUser = async (req, res) => {
  const result = await getAllUser(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleUpdateUser = async (req, res) => {
  const result = await updateUser(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetAllManagerBranch = async (req, res) => {
  const result = await getAllManagerBranchNoPosition();
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

module.exports = {
  handleCreateBrand,
  handleUpdateBrand,
  handleCreateModel,
  handleUpdateModel,
  handleCreateUser,
  handleFilterUser,
  handleGetAllUser,
  handleUpdateUser,
  handleGetAllManagerBranch,
};
