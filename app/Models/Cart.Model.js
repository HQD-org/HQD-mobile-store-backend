const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL } = require("../Common/Constants");

const cart = {
  products: {
    type: [
      {
        idProduct: DEFAULT_MODEL.stringIdMongo,
        quantity: DEFAULT_MODEL.stringRequire,
      },
    ],
    default: [],
  },
  user: DEFAULT_MODEL.stringIdMongo,
};

module.exports = Cart = mongoose.model("Cart", createSchema(cart));
