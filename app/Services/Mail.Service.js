const sendMail = require("../Common/Mailer");
const { HTTP_STATUS_CODE } = require("../Common/Constants");

const sendOtp = async (email, otp) => {
  try {
    const body =
      "Chào mừng bạn đến với HQD mobile, đây là mã xác thực của bạn: " + otp;
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

const sendNewPassword = async (email, newPassword) => {
  try {
    const body = `Đây là mật khẩu mới của bạn: ${newPassword} 
    Hãy đăng nhập lại và đổi mật khẩu để đảm bảo an toàn`;
    await sendMail(email, "Quên mật khẩu", body);

    return {
      message: "New password has been sent",
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
  sendNewPassword,
  sendOtp,
};
