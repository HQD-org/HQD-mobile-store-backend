const paypal = require("paypal-rest-sdk");
const { Cart, Product, Order } = require("../Models/Index.Model");
const queryString = require("query-string");

const OrderPaypal = async (req, res, next) => {
  const { price } = req.body;
  const dollar = price / 23100;
  const dollar2f = parseFloat(dollar.toFixed(2));
  const idUser = req.body.token.id;
  const idBranch = req.body.idBranch;
  const coupon = req.body.coupon;
  const receiver = req.body.receiveInfo.receiver;
  const phone = req.body.receiveInfo.phone;
  const address = req.body.receiveInfo.address;
  const receiveAt = req.body.receiveInfo.receiveAt;
  const timeReceive = req.body.receiveInfo.timeReceive;
  //const status = req.body.status;
  const message = req.body.receiveInfo.message;
  const reqQuery = queryString.stringify({
    idUser,
    idBranch,
    coupon,
    receiver,
    phone,
    address,
    receiveAt,
    timeReceive,
    // status,
    message,
    dollar2f,
    price,
  });

  // console.log("info: " + reqQuery);

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url:
        req.body.from === "web"
          ? `https://hqd-mobile-store-api.herokuapp.com/payment/success-web?${reqQuery}`
          : `https://hqd-mobile-store-api.herokuapp.com/payment/success?${reqQuery}`, //http://localhost:8080
      cancel_url:
        req.body.from === "web"
          ? "https://hqd-mobile-store-api.herokuapp.com/payment/cancel-web"
          : "https://hqd-mobile-store-api.herokuapp.com/payment/cancel",
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
      // console.log(error.response.details);
      res.status(400).send({
        data: "",
        error: "Cannot create order!",
        message: {
          ENG: "Cannot create order!",
          VN: "Không thể tạo hóa đơn",
        },
        success: false,
      });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.status(200).send({
            data: payment.links[i].href,
            error: "Create order! success",
            message: {
              ENG: "Create order! success",
              VN: "Tạo hóa đơn thành công",
            },
            success: true,
          });
          //res.redirect(payment.links[i].href);
        }
      }
    }
  });
};

const PaymentSuccess = async (req, res, next) => {
  const {
    idUser,
    idBranch,
    coupon,
    receiver,
    phone,
    address,
    receiveAt,
    timeReceive,
    // status,
    message,
    dollar2f,
    price,
  } = req.query;
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  //const price = req.query.price;
  // console.log(paymentId);
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: `${dollar2f}`,
        },
      },
    ],
  };
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        res.status(400).send({
          data: "",
          error: "Payment Fail",
          message: {
            ENG: "Payment Fail",
            VN: "Thanh toán thất bại",
          },
        });
      } else {
        //save Order vao db
        try {
          const cart = await Cart.findOne({ user: idUser });
          if (!cart) {
            res.status(404).send({
              data: "",
              error: "Your cart is not exsit",
              message: {
                ENG: "Your cart is not exsit",
                VN: "Giỏ hàng không tồn tại",
              },
            });
          }
          const products = cart.products; // lấy list sản phẩm
          let totalPrice = 0; // lấy tổng tiền
          let idB = idBranch || "61a23e0527b5b90016616975";
          for (const p of products) {
            totalPrice = totalPrice + p.price;
            let quantityP = p.quantity;
            let colorP = p.color;
            // trừ sản phẩm trong kho
            const product = await Product.findOne({
              _id: p.idProduct,
            });
            const r = product.color.map((item) => {
              if (item.name === colorP) {
                const quantityInfo = item.quantityInfo.map((quantity) => {
                  if (quantity.idBranch === idB) {
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
          const reInfo = {
            receiver: receiver,
            phone: phone,
            address: address,
            receiveAt: receiveAt,
            timeReceive: timeReceive,
            status: "online",
            message: message,
          };

          // console.log("reInfo:" + reInfo);
          // console.log("receiver:" + reInfo.receiver);
          const newOrder = new Order({
            products: products,
            idBranch: idB,
            totalPrice: price,
            coupon: coupon,
            user: idUser,
            receiveInfo: reInfo,
            status: "wait",
            idPayment: paymentId,
            saleId: payment.transactions[0].related_resources[0].sale.id,
          });

          await newOrder.save();

          // xóa cart cũ
          //await Cart.deleteOne({user:idUser});
          await Cart.findOneAndUpdate(
            { user: idUser },
            { $set: { products: [] } }
          );
          // console.log(newOrder);
          res.status(200).send({
            data: "",
            message: {
              ENG: "Payment Succes",
              VN: "Thanh toán thành công",
            },
          });
        } catch (err) {
          console.log(err);
          res.status(400).send({
            data: "",
            error: "Payment Excute Fail",
            message: {
              ENG: "Payment Excute Fail",
              VN: "Thanh toán thất bại error",
            },
          });
        }
      }
    }
  );
};

const PaymentSuccessWeb = async (req, res, next) => {
  const {
    idUser,
    idBranch,
    coupon,
    receiver,
    phone,
    address,
    receiveAt,
    timeReceive,
    message,
    dollar2f,
    price,
  } = req.query;
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: `${dollar2f}`,
        },
      },
    ],
  };
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        res.redirect("https://hqdmobilestore.herokuapp.com/error/payment");
      } else {
        //save Order vao db
        try {
          const cart = await Cart.findOne({ user: idUser });
          if (!cart) {
            res.redirect("https://hqdmobilestore.herokuapp.com/error/payment");
          }
          const products = cart.products; // lấy list sản phẩm
          let totalPrice = 0; // lấy tổng tiền
          let idB = idBranch || "61a23e0527b5b90016616975";
          for (const p of products) {
            totalPrice = totalPrice + p.price;
            let quantityP = p.quantity;
            let colorP = p.color;
            // trừ sản phẩm trong kho
            const product = await Product.findOne({
              _id: p.idProduct,
            });
            const r = product.color.map((item) => {
              if (item.name === colorP) {
                const quantityInfo = item.quantityInfo.map((quantity) => {
                  if (quantity.idBranch === idB) {
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
          const reInfo = {
            receiver: receiver,
            phone: phone,
            address: address,
            receiveAt: receiveAt,
            timeReceive: timeReceive,
            status: "online",
            message: message,
          };

          // console.log("reInfo:" + reInfo);
          // console.log("receiver:" + reInfo.receiver);
          const newOrder = new Order({
            products: products,
            idBranch: idB,
            totalPrice: price,
            coupon: coupon,
            user: idUser,
            receiveInfo: reInfo,
            status: "wait",
            saleId: payment.transactions[0].related_resources[0].sale.id,
          });

          await newOrder.save();
          // xóa cart cũ
          //await Cart.deleteOne({user:idUser});
          await Cart.findOneAndUpdate(
            { user: idUser },
            { $set: { products: [] } }
          );
          // console.log(newOrder);
          res.redirect("https://hqdmobilestore.herokuapp.com/");
        } catch (err) {
          // console.log(err);
          res.redirect("https://hqdmobilestore.herokuapp.com/error/payment");
        }
      }
    }
  );
};

const CancelPayment = async (req, res, next) => {
  res.status(400).send("Payment is canceled");
};

const CancelPaymentWeb = async (req, res, next) => {
  res.redirect("https://hqdmobilestore.herokuapp.com/error/payment");
};

const RefundPayment = async (req, res, next) => {
  const { saleId, totalPrice } = req.body;
  const dollar = totalPrice / 23100;
  const dollar2f = parseFloat(dollar.toFixed(2));
  const data = {
    amount: {
      total: `${dollar2f}`,
      currency: "USD",
    },
  };
  paypal.sale.refund(saleId, data, function (error, refund) {
    if (error) {
      res.status(200).send({
        message: "Refund fail!",
        data: "",
        error: error,
      });
    } else {
      res.status(200).send({
        message: "Refund success!",
        data: refund,
        error: "",
      });
    }
  });
};

module.exports = {
  OrderPaypal,
  PaymentSuccess,
  PaymentSuccessWeb,
  CancelPayment,
  CancelPaymentWeb,
  RefundPayment,
};
