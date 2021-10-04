const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const branch = {
  name: DEFAULT_MODEL.stringUnique,
  address: {
    type: {
      detail: DEFAULT_MODEL.string,
      village: DEFAULT_MODEL.string,
      district: DEFAULT_MODEL.string,
      province: DEFAULT_MODEL.string,
    },
    default: {},
  },
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.OPEN },
};

module.exports = Branch = mongoose.model("Branch", createSchema(branch));
