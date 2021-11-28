const { MobileModel, Product, MobileBrand } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const { mapToRegexContains } = require("../Common/Helper");
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

const getDataProduct = async (query) => {
  try {
    const product = await Product.findOne({ _id: query.id });
    if (!product) {
      return {
        success: false,
        message: {
          ENG: "Product not exist",
          VN: "Sản phẩm không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    const model = await MobileModel.findOne({ _id: product.idModel });
    if (!model) {
      return {
        success: false,
        message: {
          ENG: "Model not exist",
          VN: "Model không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    const dataProduct = await Product.findOne({ _id: query.id }).populate(
      "idModel"
    );
    console.log(dataProduct);
    return {
      success: true,
      data: {
        product: product,
        model: model,
      },
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

const getAllData = async () => {
  try {
    const getAll = await Product.find({}).populate("idModel");
    return {
      success: true,
      data: getAll || [],
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

const filterByBrand = async (query) => {
  try {
    const dataBrand = await MobileBrand.find().lean();
    const idBrandCast = mongoose.Types.ObjectId(query.idBrand);
    const list = []; // list ID của model theo Brand đã truyền
    const listProduct = [];
    if (!dataBrand) {
      return {
        success: false,
        message: {
          ENG: "Brand is not Exist",
          VN: "Hãng không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    const dataModel = await MobileModel.find({ idBrand: idBrandCast });
    for (let i = 0; i < dataModel.length; i++) {
      list.push(dataModel[i]._id);
    }
    for (const id of list) {
      const resultProduct = await Product.find({}).populate({
        path: "idModel",
        match: { idModel: id },
      });
      listProduct.push({ ...resultProduct.idModel, product: resultProduct });
    }
    return {
      success: true,
      data: listProduct,
      message: {
        ENG: "Get data product by Brand success",
        VN: "Lấy dữ liệu sản phẩm theo Brand thành công",
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
  let { name, itemPerPage, page, idModel } = query;
  itemPerPage = ~~itemPerPage || 12;
  page = ~~page || 1;
  const queryObj = {};
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

const filterByPrice = async (query) => {
  let { minPrice, maxPrice, name, itemPerPage, page, ...remainQuery } = query;
  itemPerPage = ~~itemPerPage || 12;
  page = ~~page || 1;
  mapToRegexContains(remainQuery);
  const queryObj = {
    ...remainQuery,
  };

  let products = [];
  let totalItem = 0;
  if (minPrice && maxPrice) {
    queryObj.minPrice = new RegExp("^" + minPrice + "$", "i");
    queryObj.maxPrice = new RegExp("^" + maxPrice + "$", "i");
    products = await Product.find({
      $and: [
        { "color.price": { $gte: minPrice } },
        { "color.price": { $lte: maxPrice } },
      ],
    }).populate("idModel");
    totalItem = await Product.find({
      $and: [
        { "color.price": { $gte: minPrice } },
        { "color.price": { $lte: maxPrice } },
      ],
    })
      .populate("idModel")
      .countDocuments();
    console.log("min max");
    return {
      success: true,
      data: {
        products,
        pagination: { itemPerPage, page, totalItem },
      },
      message: {
        ENG: "Find successfully",
        VN: "Tìm kiếm thành công",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  }
  if (minPrice) {
    queryObj.minPrice = new RegExp("^" + minPrice + "$", "i");
    products = await Product.find({
      "color.price": { $lt: minPrice },
    }).populate("idModel");
    totalItem = await Product.find({ "color.price": { $lt: minPrice } })
      .populate("idModel")
      .countDocuments();
    console.log("min");
    return {
      success: true,
      data: {
        products,
        pagination: { itemPerPage, page, totalItem },
      },
      message: {
        ENG: "Find successfully",
        VN: "Tìm kiếm thành công",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  }
  if (maxPrice) {
    queryObj.maxPrice = new RegExp("^" + maxPrice + "$", "i");

    products = await Product.find({
      "color.price": { $gt: maxPrice },
    }).populate("idModel");
    totalItem = await Product.find({ "color.price": { $gt: maxPrice } })
      .populate("idModel")
      .countDocuments();
    console.log("max");
    return {
      success: true,
      data: {
        products,
        pagination: { itemPerPage, page, totalItem },
      },
      message: {
        ENG: "Find successfully",
        VN: "Tìm kiếm thành công",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDataProduct,
  getAllData,
  filterByBrand,
  filter,
  filterByPrice,
};
