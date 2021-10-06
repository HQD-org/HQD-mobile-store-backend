const { Account, User } = require("../Models/Index.Model");
const bcrypt = require("bcrypt");
const { HTTP_STATUS_CODE, ROLE, AUTH_TYPE } = require("../Common/Constants");
const { generateString } = require("../Common/Helper");
const { sendNewPassword, sendOtp } = require("./Mail.Service");

const changePassword = async (idUser, oldPassword, newPassword) => {
  try {
    const account = await Account.findOne({ idUser: idUser });
    if (!account)
      return {
        message: "Account not found",
        success: false,
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };

    const isCorrectPassword = await bcrypt.compare(
      oldPassword,
      account.password
    );
    if (!isCorrectPassword) {
      return {
        message: "Password is incorrect",
        success: false,
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    await account.save();
    return {
      data: "",
      success: true,
      message: "Change password successfully",
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
        message: "Account not found",
        success: false,
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    const randomPassword = await generateString(8, true);
    await sendNewPassword(email, randomPassword);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    account.password = hashedPassword;
    await account.save();
    return {
      data: "",
      success: true,
      message: "New password has been sent",
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

const getRole = async (idUser) => {
  try {
    const account = await Account.findOne({ idUser: idUser });
    if (!account)
      return {
        success: false,
        message: "Account not found",
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };

    return {
      data: { role: account.role },
      success: true,
      message: "Get role successfully",
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
        message: "User not found",
        success: false,
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }

    const isCorrectPassword = await bcrypt.compare(password, account.password);
    if (!isCorrectPassword) {
      return {
        message: "Password is incorrect",
        success: false,
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
      };
    }

    if (account.isVerified === false) {
      const user = await User.findById(account.idUser);
      if (!user)
        return {
          message: "User not found",
          success: false,
          status: HTTP_STATUS_CODE.NOT_FOUND,
        };
      const otp = await generateString(4, false);
      await sendOtp(user.email, otp);
      account.otp = otp;
      await account.save();
      return {
        message: "Please verify your account",
        success: false,
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
      };
    }

    return {
      message: "Login Successfully",
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
        data: "",
        success: false,
        message: "Email already has been used",
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      };

    const userWithPhoneExists = await User.findOne({ phone: phone });
    if (userWithPhoneExists)
      return {
        data: "",
        success: false,
        message: "Phone already has been used",
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      };

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateString(4, false);
    await sendOtp(email, otp);
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
      data: "",
      success: true,
      message: "Register successfully. Please verify your account",
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

const verifyAccount = async (username, otp) => {
  try {
    const account = await Account.findOne({ username: username });
    if (!account) {
      return {
        success: false,
        message: "Account not found",
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }

    if (account.otp === otp) {
      account.isVerified = true;
      await account.save();
    }

    if (account.isVerified === true)
      return {
        data: "",
        success: true,
        message: "Your account is verified",
        status: HTTP_STATUS_CODE.OK,
      };

    return {
      success: false,
      message: "Invalid otp",
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
  getRole,
  login,
  register,
  verifyAccount,
};
