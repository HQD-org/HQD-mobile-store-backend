const e = require("express");
const paypal = require("paypal-rest-sdk");
const { Cart, Product ,  Order, } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const { sendError, sendSuccess } = require("./Controller");

  const OrderPaypal = async(req, res, next)=> {
    const { price } = req.body;
    console.log(req.body.token.id);
    console.log("price",price);
    const dollar = price/23100;
    const dollar2f = parseFloat(dollar.toFixed(2));
    const idUser = req.body.token.id;
    const idBranch = req.body.idBranch;
    const coupon = req.body.coupon;
    const receiver = req.body.receiver;
    const phone = req.body.phone;
    const address = req.body.address;
    const receiveAt = req.body.receiveAt;
    const timeReceive = req.body.timeReceive;
    const status = req.body.status;
    const message = req.body.message;
    const reqQuery = queryString.stringify({
      idUser,
      idBranch,
      coupon,
      receiver,
      phone,
      address,
      receiveAt,
      timeReceive,
      status,
      message,
    });


    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http:///localhost:8080/payment/success?price=${dollar2f}?${reqQuery}`,
        cancel_url: "http://localhost:8080/payment/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Tiền hóa đơn",
                sku: "001",
                price: `${dollar2f}`,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: `${dollar2f}`,
          },
          description: "Hóa đơn mua điện thoại",
        },
      ],
    };
    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.log(error);
        res.status(400).send({
          data: "",
          error: "Cannot create order!",
          message: {
            ENG:"Cannot create order!",
            VN:"Không thể tạo hóa đơn"
          }
        });
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.status(200).send({
              data: payment.links[i].href,
              error: "Create order! success",
              message:{
                ENG:"Create order! success",
                VN:"Tạo hóa đơn thành công"
              }
            });
            //res.redirect(payment.links[i].href);
          }
        }
      }
    });
  }

  const PaymentSuccess = async(req, res, next) =>{
    let{
      idUser,
      idBranch,
      coupon,
      receiver,
      phone,
      address,
      receiveAt,
      timeReceive,
      status,
      message,
    } = req.query;
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const price = req.query.price;
    const dollar = price/23100;
    const dollar2f = parseFloat(dollar.toFixed(2));
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: `${price}`,
          },
        },
      ],
    };
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
            console.log("ủa sao fail");
          res.status(400).send({
            data:"",
            error:"Payment Fail",
            message: { 
              ENG:"Payment Fail",
              VN:"Thanh toán thất bại"
            }
          });
        } else {
          //save Order vao db
          try{
            const cart = await Cart.findOne({user:idUser});
            if(!cart){
              res.status(400).send({
                data:"",
                error:"Your cart is not exsit",
                message:{
                  ENG:"Your cart is not exsit",
                  VN:"Giỏ hàng không tồn tại"
                }
              });
            }
            const products = cart.products; // lấy list sản phẩm
            let totalPrice = 0; // lấy tổng tiền
            for(const p of products){
                totalPrice = totalPrice + p.price; 
                let quantityP = p.quantity;  
                let colorP = p.color;    
              // trừ sản phẩm trong kho
              const product =  await Product.findOne({
                _id:p.idProduct});
            const r =  product.color.map((item)=>{
                 if(item.name ===colorP)
                 {
                     const quantityInfo = item.quantityInfo.map((quantity)=>{
                         if(quantity.idBranch === idBranch)
                         {
                             quantity.quantity = quantity.quantity - quantityP;
                             return quantity;
                         }
                         return quantity;
                     });
                     item.quantityInfo = quantityInfo;
                     return item;
                 }
                 return item;
             });
            product.color = r;
            await product.save();
            }
            const newOrder = new Order({
                products: products,
                totalPrice: totalPrice,
                coupon: coupon,
                user: idUser,
                receiveInfo: {
                  receiver,
                  phone,
                  address,
                  receiveAt,
                  timeReceive,
                  status,
                  message,
                },
                status : "wait"
            });
            await newOrder.save();
            res.status(200).send({
              data:"",
              message:{
                ENG:"Payment Succes",
                VN:"Thanh toán thành công",
              }
            });
            // xóa cart cũ
            await Cart.deleteOne({user:idUser});
    
        }catch(err){
          res.status(400).send({
            data:"",
            error:"Payment Excute Fail",
            message:{
              ENG:"Payment Excute Fail",
              VN:"Thanh toán thất bại err"
            }
          });
        }
          
        }
      }
    );
  }

  const CancelPayment = async(req, res, next) =>{
    res.status(400).send("Payment is canceled");
  }

  const RefundPayment = async(req, res, next)=> {
    const {idPayment, transaction} = req.body;
    const data = {
      amount: {
        total: `${transaction}`,
        currency: 'USD'
      }
    };

    paypal.sale.refund(idPayment, data, function (error, refund){
      if (error){
        res.status(200).send({
          message: 'Refund fail!',
          data: '',
          error: error,
        });
      } else {
        res.status(200).send({
          message: 'Refund success!',
          data: refund,
          error: '',
        });
      }
    });
  }


module.exports = {
    OrderPaypal,
    PaymentSuccess,
    CancelPayment,
    RefundPayment
};
