const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL } = require("../common/constants");

const brand = {
  name: DEFAULT_MODEL.stringRequire,
};

module.exports = Brand = mongoose.model("Brand", createSchema(brand));
