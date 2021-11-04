const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const mobileBrand = {
  name: DEFAULT_MODEL.stringUnique,
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
  image: DEFAULT_MODEL.stringRequire,
  description: DEFAULT_MODEL.string,
};

module.exports = Brand = mongoose.model(
  "MobileBrand",
  createSchema(mobileBrand)
);
