const mongoose = require("mongoose");
const Schema = mongoose.Schema
const { createSchema } = require("./Create.Model");
const { DEFAULT_MODEL, STATUS } = require("../Common/Constants");

const cart = {
  products: {
    type: [
      {
        idProduct:{type:Schema.Types.ObjectId,ref:"Product"},
        quantity: {type:Number,default :1, required:true},
        price: DEFAULT_MODEL.number,
        color: {type:String,default:"",required:true},
        image: {type:String,default:"",required:true},
      },
    ],
    default: [],
  },
  user: DEFAULT_MODEL.stringIdMongo,
  status: { ...DEFAULT_MODEL.stringRequire, default: STATUS.ACTIVE },
};

module.exports = Cart = mongoose.model("Cart", createSchema(cart));
