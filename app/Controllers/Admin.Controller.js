const { createBrand, updateBrand } = require("../Services/MobileBrand.Service");
const { sendError, sendSuccess } = require("./Controller");

const handleCreateBrand = async (req, res) => {
  const result = await createBrand(req);
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

module.exports = {
  handleCreateBrand,
  handleUpdateBrand,
};
