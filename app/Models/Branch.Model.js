const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const branch = {
  name: DEFAULT_MODEL.stringUnique,
  address: DEFAULT_MODEL.stringUnique,
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.OPEN },
};

module.exports = Branch = mongoose.model("Branch", createSchema(branch));
