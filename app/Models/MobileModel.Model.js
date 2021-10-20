const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const mobileModel = {
  name: DEFAULT_MODEL.stringUnique,
  brand: DEFAULT_MODEL.object,
  screen: DEFAULT_MODEL.stringRequire,
  operation: DEFAULT_MODEL.stringRequire,
  rearCamera: DEFAULT_MODEL.stringRequire,
  frontCamera: DEFAULT_MODEL.stringRequire,
  chip: DEFAULT_MODEL.stringRequire,
  sim: DEFAULT_MODEL.stringRequire,
  battery: DEFAULT_MODEL.stringRequire,
  charger: DEFAULT_MODEL.stringRequire,
  memoryStick: { ...DEFAULT_MODEL.string, default: "Không hỗ trợ" },
  timeDebut: DEFAULT_MODEL.stringRequire,
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
  description: DEFAULT_MODEL.string,
};

module.exports = MobileModel = mongoose.model(
  "MobileModel",
  createSchema(mobileModel)
);
