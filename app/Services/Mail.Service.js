const sendMail = require("../Common/Mailer");
const { HTTP_STATUS_CODE } = require("../Common/Constants");

const sendOtp = async (email, otp) => {
  try {
    const body = "Welcome to HQD, this is your verify code: " + otp;
    await sendMail(email, "Kích hoạt tài khoản", body);

    return {
      message: "Verify code has been sent",
      data: "",
      success: true,
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    return {
      message: error.message,
      success: false,
      status: error.status,
    };
  }
}; //done

module.exports = {
  sendOtp,
};
