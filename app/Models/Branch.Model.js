const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL } = require("../Common/Constants");

const branch = {
  name: DEFAULT_MODEL.stringRequire,
  address: DEFAULT_MODEL.stringRequire,
};

module.exports = Branch = mongoose.model("Branch", createSchema(branch));
