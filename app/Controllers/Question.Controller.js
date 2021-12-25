const { sendError, sendSuccess } = require("./Controller");
const {
  createQuestion,
  updateQuestion,
  filterQuestion,
  getAll,
} = require("../Services/Question.Service");

const handleCreateQuestion = async (req, res) => {
  //const token = req.body.token;
  const result = await createQuestion(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleUpdateQuestion = async (req, res) => {
  //const token = req.body.token;
  const result = await updateQuestion(req.body);
  if (result.success)
    return sendSuccess(res, result.data, result.message, result.status);
  return sendError(res, result.message, result.status);
};

const handleFilterQuestion = async (req, res) => {
  //const token = req.body.token;
  const result = await filterQuestion(req.query);
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

module.exports = {
  handleCreateQuestion,
  handleUpdateQuestion,
  handleFilterQuestion,
  handleGetAll,
};
