const {
  filter,
  findByName,
  getAll,
} = require("../Services/MobileModel.Service");
const { sendError, sendSuccess } = require("./Controller");

const handleFilter = async (req, res) => {
  const result = await filter(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

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

module.exports = {
  handleFilter,
  handleFindByName,
  handleGetAll,
};
