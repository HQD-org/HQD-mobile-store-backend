const { Account, User, Branch } = require("../Models/Index.Model");
const bcrypt = require("bcrypt");
const { HTTP_STATUS_CODE, ROLE, AUTH_TYPE } = require("../Common/Constants");
const { generateString } = require("../Common/Helper");
const { sendPassword, sendOtp } = require("./Mail.Service");

const changePassword = async (idUser, oldPassword, newPassword) => {
  try {
    const account = await Account.findOne({
      idUser,
    }).populate("idUser");
    if (!account)
      return {
        message: {
          ENG: "Account not found",
          VN: "Tài khoản không tồn tại",
        },
        success: false,
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };

    const isCorrectPassword = await bcrypt.compare(
      oldPassword,
      account.password
    );
    if (!isCorrectPassword) {
      return {
        message: {
          ENG: "Password is incorrect",
          VN: "Mật khẩu không chính xác",
        },
        success: false,
        status: HTTP_STATUS_CODE.FORBIDDEN,
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    await account.save();
    return {
      data: "data",
      success: true,
      message: {
        ENG: "Change password successfully",
        VN: "Đổi mật khẩu thành công",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
}; //DONE

const forgotPassword = async (email) => {
  try {
    const account = await Account.findOne({ username: email });
    if (!account)
      return {
        message: {
          ENG: "Cannot send otp. Please check your email again",
          VN: "Không thể gửi mã otp. Vui lòng kiểm tra lại email",
        },
        success: false,
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
      };

    const otp = await generateString(4, false);
    await sendOtp(account.username, otp);
    account.otp = otp;
    await account.save();
    return {
      data: "data",
      message: {
        ENG: "A verify code has been sent to your email",
        VN: "Một mã otp đã được gửi đến email của bạn",
      },
      success: true,
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};

const getAuth = async (idUser) => {
  try {
    const account = await Account.findOne({ idUser }).populate("idUser");
    const branch = await Branch.findOne({ idManager: account._id });
    if (!account)
      return {
        success: false,
        message: "Unauthenticated",
        status: HTTP_STATUS_CODE.FORBIDDEN,
      };
    return {
      data: {
        user: account.idUser,
        role: account.role,
        idBranch: branch || "",
      },
      success: true,
      message: "Get auth successfully",
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};

const login = async (username, password) => {
  try {
    const account = await Account.findOne({
      username: username,
      authType: "local",
    });
    if (!account) {
      return {
        message: {
          ENG: "Account or password is incorrect",
          VN: "Tài khoản hoặc mật khẩu không chính xác",
        },
        success: false,
        status: HTTP_STATUS_CODE.FORBIDDEN,
      };
    }

    const isCorrectPassword = await bcrypt.compare(password, account.password);

    if (!isCorrectPassword) {
      return {
        message: {
          ENG: "Account or password is incorrect",
          VN: "Tài khoản hoặc mật khẩu không chính xác",
        },
        success: false,
        status: HTTP_STATUS_CODE.FORBIDDEN,
      };
    }

    if (account.isVerified === false) {
      const otp = await generateString(4, false);
      await sendOtp(account.username, otp);
      account.otp = otp;
      await account.save();
      return {
        message: {
          ENG: "Please verify your account. A verify code has been sent to your email",
          VN: "Hãy kích hoạt tài khoản của bạn. Một mã otp đã được gửi đến email của bạn",
        },
        success: false,
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
      };
    }

    return {
      message: {
        ENG: "Login Successfully",
        VN: "Đăng nhập thành công",
      },
      data: {
        idUser: account.idUser,
        role: account.role,
      },
      success: true,
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
}; //DONE

const register = async (body) => {
  try {
    const { email, phone, name, password, address } = body;
    const userWithEmailExists = await User.findOne({ email: email });
    if (userWithEmailExists)
      return {
        success: false,
        message: {
          ENG: "Email already has been used",
          VN: "Email đã được sử dụng",
        },
        status: HTTP_STATUS_CODE.CONFLICT,
      };

    const userWithPhoneExists = await User.findOne({ phone: phone });
    if (userWithPhoneExists)
      return {
        success: false,
        message: {
          ENG: "Phone already has been used",
          VN: "Số điện thoại đã được sử dụng",
        },
        status: HTTP_STATUS_CODE.CONFLICT,
      };

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateString(4, false);
    // await sendOtp(email, otp);
    const newUser = new User({
      name,
      phone,
      email,
      address,
    });

    const newAccount = new Account({
      username: email,
      password: hashedPassword,
      role: ROLE.USER,
      otp: otp,
      idUser: newUser._id,
      authType: AUTH_TYPE.LOCAL,
    });

    const newCart = new Cart({
      user: newUser._id,
    });

    await newUser.save();
    await newAccount.save();
    await newCart.save();

    return {
      data: otp,
      success: true,
      message: {
        ENG: "Register successfully. Please verify your account. A verify code has been sent to your email",
        VN: "Đăng ký thành công. Hãy kích hoạt tài khoản của bạn. Một mã otp đã được gửi đến email của bạn",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
}; //DONE

const sendNewPassword = async (email, otp) => {
  try {
    const account = await Account.findOne({ username: email });
    if (!account)
      return {
        message: {
          ENG: "Cannot send new password. Please check your email again",
          VN: "Không thể mật khẩu mới. Vui lòng kiểm tra lại email",
        },
        success: false,
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
      };

    if (otp !== account.otp)
      return {
        message: {
          ENG: "Invalid otp",
          VN: "Mã otp không đúng",
        },
        success: false,
        status: HTTP_STATUS_CODE.FORBIDDEN,
      };
    const randomPassword = await generateString(8, true);
    await sendPassword(email, randomPassword);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    account.password = hashedPassword;
    account.otp = "";
    await account.save();
    return {
      data: "data",
      success: true,
      message: {
        ENG: "New password has been sent to your email",
        VN: "Mật khẩu mới đã được gửi vào email của bạn",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};

const verifyAccount = async (username, otp) => {
  try {
    const account = await Account.findOne({ username: username });
    if (!account) {
      return {
        success: false,
        message: {
          ENG: "Account not found",
          VN: "Tài khoản không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }

    if (account.otp === otp) {
      account.isVerified = true;
      account.otp = "";
      await account.save();
    }

    if (account.isVerified === true)
      return {
        data: "data",
        success: true,
        message: {
          ENG: "Your account is verified",
          VN: "Tài khoản của bạn đã được kích hoạt",
        },
        status: HTTP_STATUS_CODE.OK,
      };

    return {
      success: false,
      message: {
        ENG: "Invalid otp",
        VN: "Mã otp không hợp đúng",
      },
      status: HTTP_STATUS_CODE.UNAUTHORIZED,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
}; //DONE

module.exports = {
  changePassword,
  forgotPassword,
  getAuth,
  login,
  register,
  sendNewPassword,
  verifyAccount,
};
