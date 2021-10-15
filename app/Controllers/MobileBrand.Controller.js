const {
  findByName,
  filterByStatus,
  getAll,
} = require("../Services/MobileBrand.Service");
const { sendError, sendSuccess } = require("./Controller");

const handleFindByName = async (req, res) => {
  const result = await findByName(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetAll = async (req, res) => {
  const result = await getAll(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleFilterByStatus = async (req, res) => {
  const result = await filterByStatus(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

module.exports = {
  handleFindByName,
  handleFilterByStatus,
  handleGetAll,
};
