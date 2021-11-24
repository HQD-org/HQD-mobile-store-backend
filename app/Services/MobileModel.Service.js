const { MobileBrand, MobileModel } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const { mapToRegexContains } = require("../Common/Helper");
const mongoose = require('mongoose');

const uniqueColor = (arrayColor) => {
  const flags = [],
    uniqueColor = [];
  for (let i = 0; i < arrayColor.length; i++) {
    if (flags[arrayColor[i].name]) continue;
    flags[arrayColor[i].name] = true;
    uniqueColor.push(arrayColor[i]);
  }
  return uniqueColor;
};

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

    body.color = uniqueColor(body.color);
    const newModel = new MobileModel(body);
    await newModel.save();
    return {
      data: newModel,
      success: true,
      message: {
        ENG: "Create Mobile Model successfully",
        VN: "Tạo model điện thoại thành công",
      },
      status: HTTP_STATUS_CODE.CREATE,
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
  let { idBrand, status, itemPerPage, page, ...remainQuery } = query;
  itemPerPage = ~~itemPerPage || 12;
  page = ~~page || 1;
  mapToRegexContains(remainQuery);
  const queryObj = {
    ...remainQuery,
  };
  if (status) queryObj.status = new RegExp("^" + status + "$", "i");
  let models =[];
  let totalItem = 0;
  if (idBrand) {
    queryObj.idBrand = mongoose.Types.ObjectId(idBrand);
    models = await MobileModel.find(queryObj)
    .skip(itemPerPage * page - itemPerPage)
    .limit(itemPerPage)
    totalItem = await MobileModel.find(queryObj).countDocuments();

  }else{

    models = await MobileModel.find(queryObj)
  if (idBrand) queryObj.idBrand = idBrand;

  const models = await MobileModel.find(queryObj)
    .populate("idBrand")
    .skip(itemPerPage * page - itemPerPage)
    .limit(itemPerPage);
   totalItem = await MobileModel.find(queryObj).countDocuments();

  }

  return {
    data: { models, pagination: { itemPerPage, page, totalItem } },
    success: true,
    message: {
      ENG: "Find successfully",
      VN: "Tìm kiếm thành công",
    },
    status: HTTP_STATUS_CODE.OK,
  };
};

const getAll = async () => {
  try {
    const models = await MobileModel.find().populate("idBrand");
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
    if (body.idBrand) {
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
    }
    if (body.color) body.color = uniqueColor(body.color);
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
  getAll,
  updateModel,
};
