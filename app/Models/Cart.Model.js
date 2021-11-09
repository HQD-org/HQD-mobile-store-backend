const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const cart = {
  products: {
    type: [
      {
        idProduct: DEFAULT_MODEL.stringIdMongo,
        quantity: DEFAULT_MODEL.stringRequire,
        price: DEFAULT_MODEL.number,
      },
    ],
    default: [],
  },
  user: DEFAULT_MODEL.stringIdMongo,
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
};

module.exports = Cart = mongoose.model("Cart", createSchema(cart));
