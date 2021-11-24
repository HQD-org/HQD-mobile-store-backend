const { Account, User } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { mapToRegexContains } = require("../Common/Helper");

const createUser = async (body) => {
  try {
    const isExistUser = await User.findOne({
      $or: [{ email: body.email }, { phone: body.phone }],
    });

    if (isExistUser) {
      return {
        status: HTTP_STATUS_CODE.CONFLICT,
        message: {
          VN: "Vui lòng kiểm tra lại email hoặc số điện thoại",
          ENG: "Please check email or phone again",
        },
        success: false,
      };
    }

    const user = await User.create(body);
    body.password = await bcrypt.hash(body.password, 10);
    const account = await Account.create({
      idUser: user._id,
      username: user.email,
      isVerified: true,
      ...body,
    });
    account.password = undefined;
    return {
      status: HTTP_STATUS_CODE.CREATE,
      message: {
        VN: "Thêm tài khoản thành công",
        ENG: "Add account successfully",
      },
      success: true,
      data: { user, account },
    };
  } catch (error) {
    return {
      status: error.status,
      message: error.message,
      success: false,
    };
  }
};

const updateProfileUser = async (idUser, body) => {
  try {
    const isExistPhone = await User.findOne({
      phone: body.phone,
    });
    if (isExistPhone) {
      return {
        message: {
          ENG: "Phone is already exist",
          VN: "Số điện thoại đã được sử dụng",
        },
        success: false,
        status: HTTP_STATUS_CODE.CONFLICT,
      };
    }

    const user = await User.findOneAndUpdate({ _id: idUser }, body, {
      new: true,
    });
    if (!user) {
      return {
        message: {
          ENG: "User not found",
          VN: "User không tồn tại",
        },
        success: false,
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    return {
      message: {
        ENG: "Update user successfully",
        VN: "Sửa User thành công",
      },
      success: true,
      status: HTTP_STATUS_CODE.OK,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};

const updateUser = async (body) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const isExistPhone = await User.findOne({
      phone: body.phone,
    });
    if (isExistPhone) {
      await session.abortTransaction();
      session.endSession();
      return {
        message: {
          ENG: "Phone is already exist",
          VN: "Số điện thoại đã được sử dụng",
        },
        success: false,
        status: HTTP_STATUS_CODE.CONFLICT,
      };
    }

    const user = await User.findOneAndUpdate({ _id: body.idUser }, body, {
      new: true,
      session,
    });
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return {
        message: {
          ENG: "User not found",
          VN: "User không tồn tại",
        },
        success: false,
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    body.password = await bcrypt.hash(body.password, 10);
    const account = await Account.findOneAndUpdate(
      { idUser: body.idUser },
      body,
      {
        new: true,
        session,
      }
    );
    if (!account) {
      await session.abortTransaction();
      session.endSession();
      return {
        message: {
          ENG: "User not found",
          VN: "User không tồn tại",
        },
        success: false,
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    account.password = undefined;
    await session.commitTransaction();
    session.endSession();
    return {
      message: {
        ENG: "Update user successfully",
        VN: "Sửa User thành công",
      },
      success: true,
      status: HTTP_STATUS_CODE.OK,
      data: { user, account },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};

const getAllUser = async (query) => {
  try {
    const options = { password: 0 };
    const optionReceive = query.option;
    if (Array.isArray(optionReceive)) {
      optionReceive.forEach((option) => {
        options[option] = 1;
      });
      delete options.password;
    } else if (typeof optionReceive === "string") {
      options[optionReceive] = 1;
      delete options.password;
    }
    const accounts = await Account.find({}, options).populate(
      "idUser",
      options
    );
    return {
      message: {
        ENG: "Get list User successfully",
        VN: "Lấy tất cả người dùng thành công",
      },
      data: accounts || [],
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

const filterUser = async (query) => {
  try {
    let { idBranch, status, role, option, itemPerPage, page, ...remainQuery } =
      query;
    itemPerPage = ~~itemPerPage || 12;
    page = ~~page || 1;
    const options = { password: 0 };
    const optionReceive = query.option;
    if (Array.isArray(optionReceive)) {
      optionReceive.forEach((option) => {
        options[option] = 1;
      });
      delete options.password;
    } else if (typeof optionReceive === "string") {
      options[optionReceive] = 1;
      delete options.password;
    }

    mapToRegexContains(remainQuery);
    const userQuery = {
      ...remainQuery,
    };

    const accountQuery = {};
    if (status) accountQuery.status = new RegExp("^" + status + "$", "i");
    if (idBranch) accountQuery.idBranch = new RegExp("^" + idBranch + "$", "i");
    if (role) accountQuery.role = new RegExp("^" + role + "$", "i");

    const users = await Account.find(accountQuery, options)
      .populate({
        path: "idUser",
        match: userQuery,
        select: options,
      })
      .skip(itemPerPage * page - itemPerPage)
      .limit(itemPerPage);
    const totalItem = await Account.find(accountQuery).countDocuments();

    return {
      message: {
        ENG: "Get list User success",
        VN: "Lấy tất cả người dùng thành công",
      },
      data: { users, pagination: { itemPerPage, page, totalItem } },
      success: true,
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
};

module.exports = {
  createUser,
  filterUser,
  getAllUser,
  updateProfileUser,
  updateUser,
};
