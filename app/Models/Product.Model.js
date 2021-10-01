const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL } = require("../Common/Constants");

const product = {
  name: DEFAULT_MODEL.stringRequire,
  model: DEFAULT_MODEL.stringIdMongo,
  price: DEFAULT_MODEL.number,
  quantity: DEFAULT_MODEL.number,
  color: DEFAULT_MODEL.stringRequire,
  picture: DEFAULT_MODEL.object,
  capacity: DEFAULT_MODEL.stringRequire,
  ram: DEFAULT_MODEL.stringRequire,
  branch: DEFAULT_MODEL.stringIdMongo,
  description: DEFAULT_MODEL.string,
};

module.exports = Product = mongoose.model("Product", createSchema(product));
