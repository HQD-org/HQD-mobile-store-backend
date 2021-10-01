const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, RECEIVE_TYPE } = require("../Common/Constants");

const order = {
  idCart: DEFAULT_MODEL.stringIdMongo,
  totalPrice: DEFAULT_MODEL.number,
  coupon: DEFAULT_MODEL.stringIdMongo,
  user: DEFAULT_MODEL.stringIdMongo,
  receiveInfo: {
    type: {
      receiver: DEFAULT_MODEL.stringRequire,
      phone: DEFAULT_MODEL.stringPhone,
      address: DEFAULT_MODEL.stringRequire,
      receiveAt: { ...DEFAULT_MODEL.stringRequire, default: RECEIVE_TYPE.HOME },
      timeReceive: DEFAULT_MODEL.string,
      message: DEFAULT_MODEL.string,
    },
    required: true,
  },
};

module.exports = Order = mongoose.model("Order", createSchema(order));
