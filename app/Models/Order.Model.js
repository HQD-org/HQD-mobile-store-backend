const mongoose = require("mongoose");
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, RECEIVE_TYPE, STATUS } = require("../Common/Constants");

const order = {
  //idCart: DEFAULT_MODEL.stringIdMongo,
  products: {type:[
    {
      idProduct:DEFAULT_MODEL.stringIdMongo,
      quantity:DEFAULT_MODEL.number,
      color: {type:String,default:"",required:true},
      image: {type:String,default:"",required:true},
    }
  ], 
     default:[]  
  },
  totalPrice: DEFAULT_MODEL.number,
  coupon: DEFAULT_MODEL.stringRequire,
  user: DEFAULT_MODEL.stringIdMongo,
  receiveInfo: {
    type: {
      receiver: DEFAULT_MODEL.stringRequire,
      phone: DEFAULT_MODEL.stringPhone,
      address: DEFAULT_MODEL.stringRequire,
      receiveAt: { ...DEFAULT_MODEL.stringRequire, default: RECEIVE_TYPE.HOME },
      timeReceive: DEFAULT_MODEL.string,
      status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.COD },
      message: DEFAULT_MODEL.string,
    },
    required: true,
  },
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.WAIT },
};

module.exports = Order = mongoose.model("Order", createSchema(order));
