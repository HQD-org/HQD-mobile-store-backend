const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL } = require("../Common/Constants");

const modelProduct = {
  name: DEFAULT_MODEL.stringRequire,
  brand: DEFAULT_MODEL.stringIdMongo,
  screen: DEFAULT_MODEL.stringRequire,
  operation: DEFAULT_MODEL.stringRequire,
  rearCamera: DEFAULT_MODEL.stringRequire,
  frontCamera: DEFAULT_MODEL.stringRequire,
  chip: DEFAULT_MODEL.stringRequire,
  sim: DEFAULT_MODEL.stringRequire,
  battery: DEFAULT_MODEL.stringRequire,
  charger: DEFAULT_MODEL.stringRequire,
  memoryStick: DEFAULT_MODEL.string,
  timeDebut: DEFAULT_MODEL.string,
  description: DEFAULT_MODEL.string,
};

module.exports = ModelProduct = mongoose.model(
  "ModelProduct",
  createSchema(modelProduct)
);
