const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL } = require("../Common/Constants");

const user = {
  name: DEFAULT_MODEL.stringRequire,
  phone: DEFAULT_MODEL.stringRequire,
  email: DEFAULT_MODEL.stringEmail,
  address: DEFAULT_MODEL.object,
};

module.exports = User = mongoose.model("User", createSchema(user));
