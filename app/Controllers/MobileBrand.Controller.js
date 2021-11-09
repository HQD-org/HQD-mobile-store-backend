const { filter, getAll } = require("../Services/MobileBrand.Service");
const { sendError, sendSuccess } = require("./Controller");

const handleGetAll = async (req, res) => {
  const result = await getAll();
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleFilter = async (req, res) => {
  const result = await filter(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

module.exports = {
  handleFilter,
  handleGetAll,
};
