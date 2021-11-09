const { MobileBrand } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const { mapToRegexExactly } = require("../Common/Helper");

const createBrand = async (body) => {
  try {
    const { name, status, image, description } = body;
    const brandFromDb = await MobileBrand.findOne({ name });
    if (brandFromDb) {
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
      image,
      description,
    });

    await newBrand.save();
    return {
      data: newBrand,
      success: true,
      message: {
        ENG: "Create Mobile Brand successfully",
        VN: "Tạo thương hiệu thành công",
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
  let { name, itemPerPage, page, ...remainQuery } = query;
  itemPerPage = ~~itemPerPage || 12;
  page = ~~page || 1;
  mapToRegexExactly(remainQuery);
  let queryObj = {
    ...remainQuery,
  };
  if (name) {
    queryObj.name = new RegExp(name, "i");
  }
  const brands = await MobileBrand.find(queryObj)
    .skip(itemPerPage * page - itemPerPage)
    .limit(itemPerPage);
  const totalItem = await MobileBrand.find(queryObj).countDocuments();

  return {
    data: { brands, pagination: { itemPerPage, page, totalItem } },
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
    const brands = await MobileBrand.find();
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

const updateBrand = async (body) => {
  try {
    const brand = await MobileBrand.findOneAndUpdate({ _id: body.id }, body, {
      new: true,
    });

    if (!brand)
      return {
        success: false,
        message: {
          ENG: "Brand not found",
          VN: "Không tìm thấy thương hiệu",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    return {
      data: brand,
      success: true,
      message: {
        ENG: "Update brand successfully",
        VN: "Cập nhật thương hiệu thành công",
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
  createBrand,
  filter,
  getAll,
  updateBrand,
};
