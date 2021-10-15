const { MobileBrand } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const removeFile = require("../Common/StorageEngine");

const createBrand = async (req) => {
  try {
    const file = req.file;
    if (!file)
      return {
        success: false,
        message: {
          ENG: "File not found (png, jpg, jpeg)",
          VN: "Không tìm thấy file ảnh (png, jpg, jpeg)",
        },
        status: HTTP_STATUS_CODE.BAD_REQUEST,
      };
    const path = file.path;
    const { name, status } = req.body;
    const brandFromDb = await MobileBrand.findOne({ name: name });
    if (brandFromDb) {
      removeFile(path);
      return {
        success: false,
        message: {
          ENG: "Name has been used",
          VN: "Tên đã được sử dụng",
        },
        status: HTTP_STATUS_CODE.CONFLICT,
      };
    }

    const newBrand = new MobileBrand({
      name,
      status,
      image: path,
    });

    await newBrand.save();
    return {
      data: newBrand,
      success: true,
      message: {
        ENG: "Create Mobile Brand successfully",
        VN: "Tạo thương hiệu thành công",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    removeFile(req.file);
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};

const findByName = async (query) => {
  try {
    let itemPerPage = ~~query.itemPerPage || 12;
    let page = ~~query.page || 1;
    const name = query.searchTerm;
    let brands = [];
    if (name) {
      brands = await MobileBrand.find({
        name: new RegExp(name, "i"),
      })
        .skip(itemPerPage * page - itemPerPage)
        .limit(itemPerPage);
    } else {
      brands = await MobileBrand.find()
        .skip(itemPerPage * page - itemPerPage)
        .limit(itemPerPage);
    }
    return {
      data: brands,
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

const filterByStatus = async (query) => {
  let itemPerPage = ~~query.itemPerPage || 12;
  let page = ~~query.page || 1;
  const { searchTerm, status } = query;
  let brands = [];
  if (searchTerm && status) {
    brands = await MobileBrand.find({
      name: new RegExp(searchTerm, "i"),
      status: new RegExp("^" + status + "$", "i"),
    })
      .skip(itemPerPage * page - itemPerPage)
      .limit(itemPerPage);
  } else if (searchTerm && !status) {
    brands = await MobileBrand.find({
      name: new RegExp(searchTerm, "i"),
    })
      .skip(itemPerPage * page - itemPerPage)
      .limit(itemPerPage);
  } else if (!searchTerm && status) {
    brands = await MobileBrand.find({
      status: new RegExp("^" + status + "$", "i"),
    })
      .skip(itemPerPage * page - itemPerPage)
      .limit(itemPerPage);
  } else {
    brands = await MobileBrand.find()
      .skip(itemPerPage * page - itemPerPage)
      .limit(itemPerPage);
  }
  return {
    data: brands,
    success: true,
    message: {
      ENG: "Find successfully",
      VN: "Tìm kiếm thành công",
    },
    status: HTTP_STATUS_CODE.OK,
  };
};

const getAll = async (query) => {
  try {
    let itemPerPage = ~~query.itemPerPage || 12;
    let page = ~~query.page || 1;
    const brands = await MobileBrand.find()
      .skip(itemPerPage * page - itemPerPage)
      .limit(itemPerPage);
    return {
      data: brands,
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

const updateBrand = async (req) => {
  try {
    const newInfo = req.body;
    const file = req.file;
    let oldPath = "";
    if (file) {
      newInfo.image = file.path;
      const oldBrand = await MobileBrand.findById({ _id: newInfo.id });
      if (!oldBrand) {
        removeFile(file.path);
        return {
          success: false,
          message: {
            ENG: "Brand not found",
            VN: "Không tìm thấy thương hiệu",
          },
          status: HTTP_STATUS_CODE.NOT_FOUND,
        };
      }
      oldPath = oldBrand.image;
    }
    const brand = await MobileBrand.findOneAndUpdate(
      { _id: newInfo.id },
      req.body,
      {
        new: true,
      }
    );

    if (!brand) {
      removeFile(file.path);
      return {
        success: false,
        message: {
          ENG: "Brand not found",
          VN: "Không tìm thấy thương hiệu",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    removeFile(oldPath);
    return {
      data: brand,
      success: true,
      message: {
        ENG: "Update brand successfully",
        VN: "Cập nhật thương hiệu thành công",
      },
      status: HTTP_STATUS_CODE.NOT_FOUND,
    };
  } catch (error) {
    removeFile(file.path);
    return {
      message: error.message,
      status: error.status,
      success: false,
    };
  }
};

module.exports = {
  createBrand,
  findByName,
  filterByStatus,
  getAll,
  updateBrand,
};
