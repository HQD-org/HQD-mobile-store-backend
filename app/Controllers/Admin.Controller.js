const { createBrand, updateBrand } = require("../Services/MobileBrand.Service");
const { createModel, updateModel } = require("../Services/MobileModel.Service");
const { sendError, sendSuccess } = require("./Controller");

const handleCreateBrand = async (req, res) => {
  const result = await createBrand(req);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleCreateModel = async (req, res) => {
  const result = await createModel(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleUpdateBrand = async (req, res) => {
  const result = await updateBrand(req);
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

module.exports = {
  handleCreateBrand,
  handleCreateModel,
  handleUpdateBrand,
  handleUpdateModel,
};
