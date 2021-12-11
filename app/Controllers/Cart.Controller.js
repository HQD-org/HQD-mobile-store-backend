const { sendError, sendSuccess } = require("./Controller");
const {
  addToCart,
  updateCart,
  updateCartGuest,
  deleteProductInCart,
  getProductInCart,
  getCart,
  mergeCart,
} = require("../Services/Cart.Service");

const handleAddToCart = async (req, res) => {
  const token = req.body.token.id;
  const result = await addToCart(token, req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleUpdateCart = async (req, res) => {
  const token = req.body.token.id;
  const result = await updateCart(token, req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleDeleteProductInCart = async (req, res) => {
  const token = req.body.token.id;
  const result = await deleteProductInCart(token, req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetProductInCart = async (req, res) => {
  const token = req.body.token.id;
  const result = await getProductInCart(token, req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleGetCart = async (req, res) => {
  const idUser = req.body.token.id;
  const result = await getCart(idUser, req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

// cart controller cho guest (chua dang nhap)
const handleUpdateCartGuest = async (req, res) => {
  const result = await updateCartGuest(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleMergeCart = async (req, res) => {
  const idUser = req.body.token.id;
  const result = await mergeCart(idUser, req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

module.exports = {
  handleAddToCart,
  handleUpdateCart,
  handleUpdateCartGuest,
  handleDeleteProductInCart,
  handleGetProductInCart,
  handleGetCart,
  handleMergeCart,
};
