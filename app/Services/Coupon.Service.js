const { Coupon } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const { mapToRegexExactly } = require("../Common/Helper");

const create = async (body) => {
  try {
    const couponInDb = await Coupon.findOne({ name: body.name });
    if (couponInDb) {
      return {
        success: false,
        message: {
          ENG: "Name has been used",
          VN: "Tên đã được sử dụng",
        },
        status: HTTP_STATUS_CODE.CONFLICT,
      };
    }

    const newCoupon = new Coupon(body);
    await newCoupon.save();

    return {
      data: newCoupon,
      success: true,
      message: {
        ENG: "Create Coupon successfully",
        VN: "Tạo mã khuyến mãi thành công",
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
  const coupons = await Coupon.find(queryObj)
    .skip(itemPerPage * page - itemPerPage)
    .limit(itemPerPage);
  const totalItem = await Coupon.find(queryObj).countDocuments();

  return {
    data: { coupons, pagination: { itemPerPage, page, totalItem } },
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
    const brands = await Coupon.find();
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

const update = async (body) => {
  try {
    const coupon = await Coupon.findOneAndUpdate({ _id: body.id }, body, {
      new: true,
    });

    if (!coupon)
      return {
        success: false,
        message: {
          ENG: "Coupon not found",
          VN: "Không tìm thấy mã khuyến mãi",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    return {
      data: coupon,
      success: true,
      message: {
        ENG: "Update coupon successfully",
        VN: "Cập nhật mã khuyến mãi thành công",
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

const use = async (body) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      { _id: body.id },
      { $inc: { quantity: -1 } },
      { new: true }
    );
    if (!coupon)
      return {
        success: false,
        message: {
          ENG: "Coupon not found",
          VN: "Không tìm thấy mã khuyến mãi",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    return {
      data: coupon,
      success: true,
      message: {
        ENG: "Use coupon successfully",
        VN: "Sử dụng mã khuyến mãi thành công",
      },
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

const findByName = async (query)=>{
  try{
    const couponName = await Coupon.findOne({name : query.name});
    if(!couponName)
    {
      return{
        success: false,
        message: {
          ENG: "Coupon not found",
          VN: "Không tìm thấy mã khuyến mãi",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      }

    }
    return {
      data: couponName,
      success: true,
      message: {
        ENG: "Use coupon successfully",
        VN: "Sử dụng mã khuyến mãi thành công",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  }catch(err){
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
}

module.exports = {
  create,
  filter,
  getAll,
  update,
  use,
  findByName
};
