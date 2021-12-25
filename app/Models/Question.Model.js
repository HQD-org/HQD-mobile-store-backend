const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");

const question = {
  questionSentence: { type: String, require: true, default: "null" },
  answer: { type: String, require: true, default: "null" },
  status: { type: String, require: true },
};

module.exports = Question = mongoose.model("Question", createSchema(question));
