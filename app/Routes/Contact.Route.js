

const controller = require("../Controllers/Contact.Controller");
const express = require("express");
const { verifyToken } = require("../Middlewares/Token.Middleware");
const router = express.Router();

router.route('/send-contact').post(controller.handlerSendMailContact);

module.exports = router