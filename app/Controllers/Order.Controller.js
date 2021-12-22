const { sendError, sendSuccess } = require("./Controller");
const {
  create,
  createForGuest,
  changeStatus,
  cancel,
  filterByBranch,
  getByStatusAndUser,
  getAllByUser,
  getByStatusAndBranch,
  getProfitByYear,
  getTop10BestSellerProduct,
} = require("../Services/Order.Service");

const handleCreate = async (req, res) => {
  const token = req.body.token.id;
  const result = await create(token, req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleChangeStatus = async (req, res) => {
  const result = await changeStatus(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleCancel = async (req, res) => {
  const token = req.body.token.id;
  const result = await cancel(token, req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetByStatusAndUser = async (req, res) => {
  const token = req.body.token.id;
  const result = await getByStatusAndUser(token, req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetAllByUser = async (req, res) => {
  const token = req.body.token.id;
  const result = await getAllByUser(token);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetByStatusAndBranch = async (req, res) => {
  const result = await getByStatusAndBranch(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleFilterByBranch = async (req, res) => {
  const result = await filterByBranch(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleCreateForGuest = async (req, res) => {
  // oder controller for guest
  const result = await createForGuest(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetProfitByYear = async (req, res) => {
  const result = await getProfitByYear(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetTop10BestSellerProduct = async (req, res) => {
  const result = await getTop10BestSellerProduct(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

module.exports = {
  handleCreate,
  handleCreateForGuest,
  handleChangeStatus,
  handleCancel,
  handleGetByStatusAndUser,
  handleGetAllByUser,
  handleGetByStatusAndBranch,
  handleFilterByBranch,
  handleGetProfitByYear,
  handleGetTop10BestSellerProduct,
};
