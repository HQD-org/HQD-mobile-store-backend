const { Account, User } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {
  convertObjToArrayProps,
  mapToRegexContainMongoDbQuery,
} = require("../Common/Helper");

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
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
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
    let {
      idBranch,
      status,
      role,
      option,
      sortBy,
      ascSort,
      itemPerPage,
      page,
      ...remainQuery
    } = query;
    itemPerPage = ~~itemPerPage || 12;
    page = ~~page || 1;

    const options = { password: 0 };
    if (Array.isArray(option)) {
      option.forEach((op) => {
        options[op] = 1;
      });
      delete options.password;
    } else if (typeof option === "string") {
      options[option] = 1;
      delete options.password;
    }

    const sortOption = {};
    const type = ascSort === "asc" ? 1 : -1;
    switch (sortBy) {
      case "name":
      case "phone":
      case "email":
        sortOption[`idUser.${sortBy}`] = type;
        break;
      case "address":
        sortOption[`idUser.address.province`] = type;
        break;
      case "role":
        sortOption.role = type;
        break;
      default:
        break;
    }

    const userQuery = mapToRegexContainMongoDbQuery(remainQuery, "idUser");
    const arrUserQuery = convertObjToArrayProps(userQuery);
    const accountQuery = {};
    if (status) accountQuery.status = status;
    if (idBranch) accountQuery.idBranch = idBranch;
    if (role) accountQuery.role = role;

    const users = await Account.aggregate([
      {
        $match: accountQuery,
      },
      {
        $lookup: {
          from: "users",
          localField: "idUser",
          foreignField: "_id",
          as: "idUser",
        },
      },
      {
        $unwind: "$idUser",
      },
      {
        $match: arrUserQuery.length > 0 ? { $or: arrUserQuery } : {},
      },
      {
        $facet: {
          data: [
            {
              $sort: sortOption,
            },
            { $skip: itemPerPage * page - itemPerPage },
            { $limit: itemPerPage },
          ],
          info: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);
    const info = users[0].info;
    return {
      message: {
        ENG: "Get list User success",
        VN: "Tìm kiếm người dùng thành công",
      },
      data: {
        users: users[0].data,
        pagination: {
          itemPerPage,
          page,
          totalItem: info.length > 0 ? info[0].count : 0,
        },
      },
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
