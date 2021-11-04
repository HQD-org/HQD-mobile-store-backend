const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const product = {
  name: DEFAULT_MODEL.stringRequire,
  model: DEFAULT_MODEL.object,
  capacity: DEFAULT_MODEL.stringRequire,
  ram: DEFAULT_MODEL.stringRequire,
  color: {
    type: [
      {
        name: DEFAULT_MODEL.stringRequire,
        price: DEFAULT_MODEL.number,
        quantityInfo: {
          type: [
            {
              idBranch: DEFAULT_MODEL.stringIdMongo,
              quantity: DEFAULT_MODEL.number,
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
  description: DEFAULT_MODEL.string,
};

module.exports = Product = mongoose.model("Product", createSchema(product));
