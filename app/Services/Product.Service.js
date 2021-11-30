const { MobileModel, Product } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const createProduct = async (body) => {
  try {
    const model = await MobileModel.findOne({ _id: body.idModel });
    if (!model) {
      return {
        success: false,
        message: {
          ENG: "Model of product not found",
          VN: "Không tìn thấy model của sản phẩm",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }

    const colors = body.color;
    model.color.forEach((item) => {
      if (!colors.find((color) => color.name === item.name)) {
        colors.push({
          name: item.name,
          price: 0,
        });
      }
    });
    body.color = colors;
    const newProduct = await Product.create(body);
    return {
      data: newProduct,
      success: true,
      message: {
        ENG: "Create Product successfull",
        VN: "Tạo sản phẩm thành công",
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

const updateProduct = async (body) => {
  try {
    const newProduct = await Product.findOneAndUpdate({ _id: body.id }, body, {
      new: true,
    });
    if (!newProduct) {
      return {
        success: false,
        message: {
          ENG: "Product not exist",
          VN: "Sản phẩm không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    return {
      data: newProduct,
      success: true,
      message: {
        ENG: "Update product successfull",
        VN: "Sửa sản phẩm thành công",
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

const updateQuantityProduct = async (body) => {
  try {
    const account = await Account.findOne({ idUser: body.token.id });
    if (!account)
      return {
        success: false,
        message: { ENG: "User not found", VN: "Không tìn thấy user" },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };

    const branchExist = await Branch.findOne({ idManager: account._id });
    if (!branchExist)
      return {
        success: false,
        message: { ENG: "Branch not found", VN: "Không tìn thấy chi nhánh" },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };

    const product = await Product.findById(body.id);
    if (!product)
      return {
        success: false,
        message: {
          ENG: "Product not exist",
          VN: "Sản phẩm không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };

    product.color = product.color.map((item) => {
      const infoFromBody = body.color.find((color) => color.name === item.name);
      if (infoFromBody) {
        const branchIndex = item.quantityInfo.findIndex(
          (branch) => branch.idBranch == branchExist._id
        );
        if (branchIndex !== -1) {
          item.quantityInfo[branchIndex].quantity = infoFromBody.quantity;
        } else {
          item.quantityInfo.push({
            idBranch: branchExist._id,
            quantity: infoFromBody.quantity,
          });
        }
      }
      return item;
    });
    await product.save();

    return {
      success: true,
      message: {
        ENG: "Update quantity product successfull",
        VN: "Cập nhật số lượng sản phẩm thành công",
      },
      status: HTTP_STATUS_CODE.OK,
      data: product,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
};

const findById = async (params) => {
  try {
    const product = await Product.aggregate([
      {
        $match: { _id: ObjectId(params.id) },
      },
      {
        $lookup: {
          from: "mobilemodels",
          localField: "idModel",
          foreignField: "_id",
          as: "model",
        },
      },
      {
        $unwind: {
          path: "$model",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "mobilebrands",
          localField: "model.idBrand",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand",
      },
    ]);
    if (!product[0]) {
      return {
        success: false,
        message: {
          ENG: "Product not exist",
          VN: "Sản phẩm không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }

    return {
      success: true,
      data: product[0],
      message: {
        ENG: "Get data successfull",
        VN: "lấy thông tin sản phẩm thành công",
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

const getAll = async () => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "mobilemodels",
          localField: "idModel",
          foreignField: "_id",
          as: "model",
        },
      },
      {
        $unwind: {
          path: "$model",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "mobilebrands",
          localField: "model.idBrand",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand",
      },
    ]);
    return {
      success: true,
      data: products || [],
      message: {
        ENG: "getAll data product Success",
        VN: "Lấy dữ liệu tất cả sản phẩm thành công",
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

const filter = async (query) => {
  let {
    name,
    itemPerPage,
    page,
    idModel,
    idBrand,
    minPrice,
    maxPrice,
    ...remainQuery
  } = query;
  itemPerPage = ~~itemPerPage || 12;
  page = ~~page || 1;
  minPrice = ~~minPrice || 0;
  maxPrice = ~~maxPrice || 1000000000;
  const queryObj = {
    $and: [
      { "color.price": { $gte: minPrice } },
      { "color.price": { $lte: maxPrice } },
    ],
    ...remainQuery,
  };
  if (name) queryObj.name = { $regex: name, $options: "i" };
  if (idModel) queryObj.idModel = ObjectId(idModel);

  const products = await Product.aggregate([
    {
      $match: queryObj,
    },
    {
      $lookup: {
        from: "mobilemodels",
        localField: "idModel",
        foreignField: "_id",
        as: "model",
      },
    },
    {
      $unwind: {
        path: "$model",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "mobilebrands",
        localField: "model.idBrand",
        foreignField: "_id",
        as: "brand",
      },
    },
    {
      $unwind: {
        path: "$brand",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: idBrand ? { "brand._id": ObjectId(idBrand) } : {},
    },
    {
      $facet: {
        data: [
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
  const info = products[0].info;
  return {
    success: true,
    data: {
      products: products[0].data,
      pagination: {
        itemPerPage,
        page,
        totalItem: info.length > 0 ? info[0].count : 0,
      },
    },
    message: {
      ENG: "Find successfully",
      VN: "Tìm kiếm thành công",
    },
    status: HTTP_STATUS_CODE.OK,
  };
};

module.exports = {
  createProduct,
  updateProduct,
  updateQuantityProduct,
  findById,
  getAll,
  filter,
};
