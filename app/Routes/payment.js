
const express = require("express");
const router = express.Router();
const PaymentController = require('../Controllers/Payment.Controller');
const { verifyToken } = require("../Middlewares/Token.Middleware");

router.post('/order',[verifyToken], PaymentController.OrderPaypal);
router.get('/success', PaymentController.PaymentSuccess);
router.get('/cancel', PaymentController.CancelPayment);
router.post('/refund', PaymentController.RefundPayment);

module.exports = router;