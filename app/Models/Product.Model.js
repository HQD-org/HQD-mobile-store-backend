const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const product = {
  name: DEFAULT_MODEL.stringRequire,
  idModel: DEFAULT_MODEL.stringIdMongo,
  price: DEFAULT_MODEL.number,
  color: DEFAULT_MODEL.stringRequire,
  picture: DEFAULT_MODEL.object,
  capacity: DEFAULT_MODEL.stringRequire,
  ram: DEFAULT_MODEL.stringRequire,
  quantityInfo: {
    type: [
      {
        idBranch: DEFAULT_MODEL.stringIdMongo,
        quantity: DEFAULT_MODEL.number,
      },
    ],
    default: [],
  },
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
  description: DEFAULT_MODEL.string,
};

module.exports = Product = mongoose.model("Product", createSchema(product));
