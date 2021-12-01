const { Account, Branch } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const createBranch = async (body) => {
  try {
    const BranchExist = await Branch.findOne({ name: body.name });

    if (BranchExist) {
      return {
        success: false,
        message: {
          ENG: "Name Branch has been used",
          VN: "Tên chi nhánh đã được sử dụng",
        },
        status: HTTP_STATUS_CODE.CONFLICT,
      };
    }

    const hasManaged = await Branch.findOne({ idManager: body.idManager });

    if (hasManaged) {
      return {
        success: false,
        message: {
          ENG: "Manager has managed another branch",
          VN: "Quản lý đã quản lý một chi nhánh khác",
        },
        status: HTTP_STATUS_CODE.CONFLICT,
      };
    }

    const manager = await Account.findOne({ _id: body.idManager });
    if (!manager) {
      return {
        success: false,
        message: {
          ENG: "Manager not found",
          VN: "Quản lý không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }

    const newBranch = await Branch.create(body);
    manager.idBranch = newBranch._id;
    manager.save();

    return {
      data: newBranch,
      success: true,
      message: {
        ENG: "Create Branch successful",
        VN: "Tạo chi nhánh thành công",
      },
      status: HTTP_STATUS_CODE.CREATE,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
};

const getAllBranch = async () => {
  try {
    const dataBranch = await Branch.find();
    return {
      message: {
        ENG: "Get list Branch success",
        VN: "Lấy tất cả chi nhánh thành công",
      },
      data: dataBranch,
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

const updateBranch = async (body) => {
  try {
    const existName = await Branch.findOne({
      _id: { $ne: body.id },
      name: body.name,
    });
    if (existName)
      return {
        success: false,
        message: {
          ENG: "Name has been used",
          VN: "Tên đã được sử dụng",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };

    const hasManaged = await Branch.findOne({
      idManager: body.idManager,
      _id: { $ne: body.id },
    });

    if (hasManaged) {
      return {
        success: false,
        message: {
          ENG: "Manager has managed another branch",
          VN: "Quản lý đã quản lý một chi nhánh khác",
        },
        status: HTTP_STATUS_CODE.CONFLICT,
      };
    }

    const manager = await Account.findById(body.idManager);
    if (!manager)
      return {
        success: false,
        message: {
          ENG: "Manager not found",
          VN: "Không tìm thấy quản lý",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };

    const branch = await Branch.findOneAndUpdate({ _id: body.id }, body, {
      new: true,
    });
    if (!branch) {
      return {
        message: {
          ENG: "Branch not found",
          VN: "Branch không tồn tại",
        },
        success: false,
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }

    return {
      message: {
        ENG: "Upgrade successful",
        VN: "Sửa Branch thành công",
      },
      success: true,
      status: HTTP_STATUS_CODE.OK,
      data: branch,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
};

const searchBranch = async (query) => {
  try {
    let { sortBy, ascSort, itemPerPage, page, name } = query;
    itemPerPage = ~~itemPerPage || 12;
    page = ~~page || 1;

    const sortOption = {};
    const type = ascSort === "asc" ? 1 : -1;
    switch (sortBy) {
      case "address":
        sortOption[`address.province`] = type;
        break;
      case "name":
      default:
        sortOption.name = type;
        break;
    }
    const branches = await Branch.aggregate([
      {
        $match: name ? { name: { $regex: name, $options: "i" } } : {},
      },
      {
        $lookup: {
          from: "accounts",
          localField: "idManager",
          foreignField: "_id",
          as: "manager",
        },
      },
      {
        $unwind: "$manager",
      },
      {
        $project: {
          "manager.password": 0,
          "manager.authType": 0,
          "manager.authGoogleID": 0,
          "manager.authFacebookID": 0,
          "manager.isVerified": 0,
          "manager.otp": 0,
        },
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
    const info = branches[0].info;
    return {
      message: {
        ENG: "Search Branch Successful",
        VN: "Tìm kiếm Branch thành công",
      },
      data: {
        branches: branches[0].data,
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

const getByListId = async (query) => {
  try {
    let branches = [];
    if (Array.isArray(query.id)) {
      branches = await Branch.find({
        _id: { $in: query.id.map((id) => ObjectId(id)) },
      });
    }
    return {
      data: branches,
      success: true,
      message: {
        ENG: "Find successfully",
        VN: "Tìm kiếm thành công",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (err) {
    return {
      success: false,
      status: err.status,
      message: err.message,
    };
  }
};

module.exports = {
  createBranch,
  getAllBranch,
  updateBranch,
  searchBranch,
  getByListId,
};
