const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL } = require("../Common/Constants");

const user = {
  name: DEFAULT_MODEL.stringRequire,
  phone: DEFAULT_MODEL.stringPhone,
  email: DEFAULT_MODEL.stringEmail,
  address: {
    type: {
      detail: DEFAULT_MODEL.string,
      village: DEFAULT_MODEL.string,
      district: DEFAULT_MODEL.string,
      province: DEFAULT_MODEL.string,
    },
    default: {},
  },
};

module.exports = User = mongoose.model("User", createSchema(user));
