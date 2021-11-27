const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const colorSchema = createSchema({
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
});

const product = {
  name: DEFAULT_MODEL.stringRequire,
  idModel: { type: Schema.Types.ObjectId, ref: "MobileModel" },
  capacity: DEFAULT_MODEL.stringRequire,
  ram: DEFAULT_MODEL.stringRequire,
  color: {
    type: [colorSchema],
    default: [],
  },
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
  description: DEFAULT_MODEL.string,
};

module.exports = Product = mongoose.model("Product", createSchema(product));
