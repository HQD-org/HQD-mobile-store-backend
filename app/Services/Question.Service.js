const { Question } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const { mapToRegexExactly } = require("../Common/Helper");

const createQuestion = async (body) => {
  try {
    let { questionSentence, answer, status } = body;
    const existQuestion = await Question.findOne({
      questionSentence: questionSentence,
    });
    if (existQuestion) {
      return {
        data: "",
        message: {
          ENG: "Question is exist!!",
          VN: "Câu hỏi đã tồn tại",
        },
        statusCode: HTTP_STATUS_CODE.CONFLICT,
      };
    }
    const newQuestion = new Question({ questionSentence, answer, status });
    await newQuestion.save();
    return {
      success: true,
      data: "",
      message: {
        ENG: "Create successfully",
        VN: "Tạo câu hỏi thành công",
      },
      statusCode: HTTP_STATUS_CODE.OK,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
};

const updateQuestion = async (body) => {
  try {
    const updateQuestion = await Question.findOneAndUpdate(
      { _id: body.id },
      body,
      { new: true }
    );
    if (!updateQuestion) {
      return {
        data: "",
        message: {
          ENG: "Question is not exist!!",
          VN: "Câu hỏi chưa tồn tại",
        },
        statusCode: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    return {
      success: true,
      data: "",
      message: {
        ENG: "Update successfully",
        VN: "Update câu hỏi thành công",
      },
      statusCode: HTTP_STATUS_CODE.OK,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
};

const filterQuestion = async (query) => {
  let { questionSentence, status, itemPerPage, page, ...remainQuery } = query;
  itemPerPage = ~~itemPerPage || 5;
  page = ~~page || 1;
  mapToRegexExactly(remainQuery);
  let queryObj = {
    ...remainQuery,
  };
  if (questionSentence) {
    queryObj.questionSentence = new RegExp(questionSentence, "i");
  }
  if (status) {
    queryObj.status = status;
  }
  const questions = await Question.find(queryObj)
    .skip(itemPerPage * page - itemPerPage)
    .limit(itemPerPage);
  const totalItem = await Question.find(queryObj).countDocuments();

  return {
    data: {
      questions: questions,
      pagination: { itemPerPage, page, totalItem },
    },
    success: true,
    message: {
      ENG: "Find successfully",
      VN: "Tìm kiếm thành công",
    },
    status: HTTP_STATUS_CODE.OK,
  };
};

const getAll = async () => {
  try {
    const questions = await Question.find();
    return {
      data: questions,
      success: true,
      message: {
        ENG: "Find successfully",
        VN: "Tìm kiếm thành công",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};

module.exports = { createQuestion, updateQuestion, filterQuestion, getAll };
