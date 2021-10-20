const { MobileBrand, MobileModel } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const { mapToRegexExactly } = require("../Common/Helper");
const mongoose = require("mongoose");

const createModel = async (body) => {
  try {
    const brand = await MobileBrand.findById(body.idBrand);
    if (!brand)
      return {
        success: false,
        message: {
          ENG: "Mobile brand not found",
          VN: "Không tìm thấy thương hiệu",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    body.brand = brand;
    console.log(body);
    const modelFromDb = await MobileModel.findOne({ name: body.name });
    if (modelFromDb) {
      return {
        success: false,
        message: {
          ENG: "Name has been used",
          VN: "Tên đã được sử dụng",
        },
        status: HTTP_STATUS_CODE.CONFLICT,
      };
    }
    delete body.idBrand;
    const newModel = new MobileModel(body);
    await newModel.save();
    return {
      data: newModel,
      success: true,
      message: {
        ENG: "Create Mobile Model successfully",
        VN: "Tạo model điện thoại thành công",
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

const filter = async (query) => {
  let { name, idBrand, itemPerPage, page, ...remainQuery } = query;
  itemPerPage = ~~itemPerPage || 12;
  page = ~~page || 1;
  mapToRegexExactly(remainQuery);
  let queryObj = {
    name: new RegExp(name, "i"),
    ...remainQuery,
  };
  if (idBrand) {
    queryObj = {
      ...queryObj,
      "brand._id": mongoose.Types.ObjectId(idBrand),
    };
  }
  const models = await MobileModel.find(queryObj)
    .skip(itemPerPage * page - itemPerPage)
    .limit(itemPerPage);

  return {
    data: models,
    success: true,
    message: {
      ENG: "Find successfully",
      VN: "Tìm kiếm thành công",
    },
    status: HTTP_STATUS_CODE.OK,
  };
};

const findByName = async (query) => {
  try {
    let itemPerPage = ~~query.itemPerPage || 12;
    let page = ~~query.page || 1;
    const name = query.name;
    let queryObj = {};
    if (name) {
      queryObj.name = new RegExp(name, "i");
    }
    const models = await MobileModel.find(queryObj)
      .skip(itemPerPage * page - itemPerPage)
      .limit(itemPerPage);
    return {
      data: models,
      success: true,
      message: {
        ENG: "Find successfully",
        VN: "Tìm kiếm thành công",
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

const getAll = async (query) => {
  try {
    let itemPerPage = ~~query.itemPerPage || 12;
    let page = ~~query.page || 1;
    const models = await MobileModel.find()
      .skip(itemPerPage * page - itemPerPage)
      .limit(itemPerPage);
    return {
      data: models,
      success: true,
      message: {
        ENG: "Find successfully",
        VN: "Tìm kiếm thành công",
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

const updateModel = async (body) => {
  try {
    const existName = await MobileModel.findOne({
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
    const model = await MobileModel.findOneAndUpdate({ _id: body.id }, body, {
      new: true,
    });

    if (!model) {
      return {
        success: false,
        message: {
          ENG: "Model not found",
          VN: "Không tìm thấy mẫu",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    return {
      data: model,
      success: true,
      message: {
        ENG: "Update model successfully",
        VN: "Cập nhật mẫu thành công",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    return {
      message: error.message,
      status: error.status,
      success: false,
    };
  }
};

module.exports = {
  createModel,
  filter,
  findByName,
  getAll,
  updateModel,
};
