const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const cart = {
  products: {
    type: [
      {
        idProduct: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { ...DEFAULT_MODEL.number, default: 1 },
        price: DEFAULT_MODEL.number,
        color: { ...DEFAULT_MODEL.stringRequire, default: "" },
        image: { ...DEFAULT_MODEL.stringRequire, default: "" },
      },
    ],
    default: [],
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
};

module.exports = Cart = mongoose.model("Cart", createSchema(cart));
