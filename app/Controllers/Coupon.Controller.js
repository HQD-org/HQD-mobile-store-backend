const {
  filter,
  getAll,
  create,
  update,
  apply,
  generateUniqueName,
  findByName,
} = require("../Services/Coupon.Service");
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

const handleCreate = async (req, res) => {
  const result = await create(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleUpdate = async (req, res) => {
  const result = await update(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleApply = async (req, res) => {
  const result = await apply(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGenerateUniqueName = async (req, res) => {
  const result = await generateUniqueName();
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleFindCouponByName = async (req, res) => {
  const result = await findByName(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

module.exports = {
  handleFilter,
  handleGetAll,
  handleCreate,
  handleUpdate,
  handleApply,
  handleGenerateUniqueName,
  handleFindCouponByName,
};
