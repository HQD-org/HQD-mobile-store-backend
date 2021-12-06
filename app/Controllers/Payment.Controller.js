const e = require("express");
const paypal = require("paypal-rest-sdk");


  const Order = async(req, res, next)=> {
    const { price } = req.body;
    console.log(req.body.token.id);
    console.log("price",price);
    const dollar = price/23100;
    const dollar2f = parseFloat(dollar.toFixed(2));
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http:///localhost:8080/payment/success?price=${dollar2f}`,
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
        });
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.status(200).send({
              data: payment.links[i].href,
              error: "Create order! success",
            });
            //res.redirect(payment.links[i].href);
          }
        }
      }
    });
  }

  const PaymentSuccess = async(req, res, next) =>{
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
          res.status(400).send("Payment Fail");
        } else {
          //save data vao db
          //thanh toan tru 1 san pham
          // thanh toan + poin KH
          // thanh toan + tien
          // llu hoa don data in payment
          res.status(200).send("Payment Succes");
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
          msg: 'Refund fail!',
          data: '',
          error: error,
        });
      } else {
        res.status(200).send({
          msg: 'Refund success!',
          data: refund,
          error: '',
        });
      }
    });
  }


module.exports = {
    Order,
    PaymentSuccess,
    CancelPayment,
    RefundPayment
};
