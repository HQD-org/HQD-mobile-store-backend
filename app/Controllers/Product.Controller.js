const { sendError, sendSuccess } = require("./Controller");
const {
  createProduct,
  updateProduct,
  updateQuantityProduct,
  findById,
  getAll,
  filter,
  getProductGroupByBrand,
} = require("../Services/Product.Service");

const handleCreateProduct = async (req, res) => {
  const result = await createProduct(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleUpdateProduct = async (req, res) => {
  const result = await updateProduct(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleUpdateQuantityProduct = async (req, res) => {
  const result = await updateQuantityProduct(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleFindById = async (req, res) => {
  const result = await findById(req.params);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

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

const handleGetProductGroupByBrand = async (req, res) => {
  const result = await getProductGroupByBrand(req.query);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

module.exports = {
  handleCreateProduct,
  handleUpdateProduct,
  handleUpdateQuantityProduct,
  handleFindById,
  handleGetAll,
  handleFilter,
  handleGetProductGroupByBrand,
};
