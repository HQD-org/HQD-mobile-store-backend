const { Cart, Product, Order, Branch } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE, STATUS } = require("../Common/Constants");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const create = async (idUser, body) => {
  try {
    body.receiveInfo.status = "cod";
    const idBranch = body.idBranch || "61a23e0527b5b90016616975";
    const newOrder = await Order.create({
      ...body,
      user: idUser,
      idBranch,
    });
    if (!newOrder) {
      return {
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        success: false,
        message: {
          ENG: "Create Order fail",
          VN: "Tạo đơn hàng thất bại",
        },
      };
    }
    for (const p of body.products) {
      // trừ sản phẩm trong kho
      const productInDb = await Product.findOne({ _id: ObjectId(p.idProduct) });
      if (productInDb) {
        const idx = productInDb.color.findIndex(
          (item) => item.name === p.color
        );
        if (idx > -1) {
          const color = productInDb.color[idx];
          const newQuantityInfo = color.quantityInfo.map((q) => {
            if (q.idBranch == idBranch) {
              q.quantity -= p.quantity;
            }
            return q;
          });
          productInDb.color[idx].quantityInfo = newQuantityInfo;
          productInDb.save();
        }
      }
    }

    // xoa cart
    await Cart.findOneAndUpdate({ user: idUser }, { $set: { products: [] } });

    return {
      data: newOrder,
      success: true,
      message: {
        ENG: "Create Order successfully",
        VN: "Tạo đơn hàng thành công",
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

const changeStatus = async (body) => {
  try {
    const newOrder = await Order.findOneAndUpdate(
      { _id: body.idOrder },
      { status: body.status },
      {
        new: true,
      }
    );
    if (body.status === STATUS.CANCEL) {
      newOrder.products.forEach(async (p) => {
        const productInDb = await Product.findOne({
          _id: ObjectId(p.idProduct),
        });
        if (productInDb) {
          const idx = productInDb.color.findIndex(
            (item) => item.name === p.color
          );
          if (idx > -1) {
            const color = productInDb.color[idx];
            const newQuantityInfo = color.quantityInfo.map((q) => {
              if (q.idBranch == newOrder.idBranch) {
                q.quantity += p.quantity;
              }
              return q;
            });
            productInDb.color[idx].quantityInfo = newQuantityInfo;
            productInDb.save();
          }
        }
      });
    }
    if (!newOrder) {
      return {
        success: false,
        message: {
          ENG: "Order not exist",
          VN: "Hóa đơn không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    return {
      data: newOrder,
      success: true,
      message: {
        ENG: "Update status Order successfully",
        VN: "Cập nhật trạng thái đơn hàng thành công",
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

const cancel = async (idUser, body) => {
  const order = await Order.findOne({
    $and: [{ user: idUser }, { _id: body.idOrder }],
  });
  if (order.status !== STATUS.WAIT) {
    return {
      success: false,
      message: {
        ENG: "Delete Order fail",
        VN: "Xóa đơn hàng thất bại",
      },
      status: HTTP_STATUS_CODE.FORBIDDEN,
    };
  }
  order.status = STATUS.CANCEL;
  await order.save();
  order.products.forEach(async (p) => {
    const productInDb = await Product.findOne({ _id: ObjectId(p.idProduct) });
    if (productInDb) {
      const idx = productInDb.color.findIndex((item) => item.name === p.color);
      if (idx > -1) {
        const color = productInDb.color[idx];
        const newQuantityInfo = color.quantityInfo.map((q) => {
          if (q.idBranch == order.idBranch) {
            q.quantity += p.quantity;
          }
          return q;
        });
        productInDb.color[idx].quantityInfo = newQuantityInfo;
        productInDb.save();
      }
    }
  });
  return {
    data: order,
    success: true,
    message: {
      ENG: "Delete Order successfully",
      VN: "Hủy đơn hàng thành công",
    },
    status: HTTP_STATUS_CODE.OK,
  };
};

const getByStatusAndUser = async (idUser, query) => {
  try {
    let { itemPerPage, page, status } = query;
    itemPerPage = ~~itemPerPage || 12;
    page = ~~page || 1;
    const result = await Order.aggregate([
      { $match: { $and: [{ status }, { user: idUser }] } },
      {
        $lookup: {
          from: "branches",
          localField: "idBranch",
          foreignField: "_id",
          as: "branch",
        },
      },
      {
        $unwind: {
          path: "$branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $facet: {
          data: [
            {
              $sort: { createdAt: -1 },
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

    const info = result[0].info;
    return {
      success: true,
      data: {
        orders: result[0].data,
        pagination: {
          itemPerPage,
          page,
          totalItem: info.length > 0 ? info[0].count : 0,
        },
      },
      message: {
        ENG: "Get Order by status successfully",
        VN: "Lấy đơn hàng thành công",
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

const getAllByUser = async (idUser) => {
  try {
    const result = await Order.find({ user: idUser }).sort({ createdAt: -1 });
    return {
      success: true,
      data: result,
      message: {
        ENG: "Get all Order by user successfully",
        VN: "Lấy tất cả đơn hàng thành công",
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

const getByStatusAndBranch = async (query) => {
  try {
    let { itemPerPage, page, status, idBranch } = query;
    itemPerPage = ~~itemPerPage || 12;
    page = ~~page || 1;
    const branch = await Branch.findById(idBranch);
    if (!branch) {
      return {
        success: false,
        message: {
          ENG: "Branch not exist",
          VN: "Chi nhánh không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    const result = await Order.aggregate([
      { $match: { status, idBranch: ObjectId(idBranch) } },
      {
        $lookup: {
          from: "branches",
          localField: "idBranch",
          foreignField: "_id",
          as: "branch",
        },
      },
      {
        $unwind: {
          path: "$branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $facet: {
          data: [
            {
              $sort: { createdAt: -1 },
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

    const info = result[0].info;
    return {
      success: true,
      data: {
        orders: result[0].data,
        pagination: {
          itemPerPage,
          page,
          totalItem: info.length > 0 ? info[0].count : 0,
        },
      },
      message: {
        ENG: "Get Order by status successfully",
        VN: "Lấy đơn hàng thành công",
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

const filterByBranch = async (query) => {
  try {
    let { itemPerPage, page, idBranch } = query;
    itemPerPage = ~~itemPerPage || 12;
    page = ~~page || 1;
    const branch = await Branch.findById(idBranch);
    if (!branch) {
      return {
        success: false,
        message: {
          ENG: "Branch not exist",
          VN: "Chi nhánh không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    const result = await Order.aggregate([
      { $match: { idBranch: ObjectId(idBranch) } },
      {
        $lookup: {
          from: "branches",
          localField: "idBranch",
          foreignField: "_id",
          as: "branch",
        },
      },
      {
        $unwind: {
          path: "$branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $facet: {
          data: [
            {
              $sort: { createdAt: -1 },
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

    const info = result[0].info;
    return {
      success: true,
      data: {
        orders: result[0].data,
        pagination: {
          itemPerPage,
          page,
          totalItem: info.length > 0 ? info[0].count : 0,
        },
      },
      message: {
        ENG: "Get Order by status successfully",
        VN: "Lấy đơn hàng thành công",
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

// order service  for guest
const createForGuest = async (body) => {
  try {
    body.receiveInfo.status = "cod";
    const idBranch = body.idBranch || "61a23e0527b5b90016616975";
    const newOrder = await Order.create({
      ...body,
      idBranch,
    });
    if (!newOrder) {
      return {
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        success: false,
        message: {
          ENG: "Create Order fail",
          VN: "Tạo đơn hàng thất bại",
        },
      };
    }
    for (const p of body.products) {
      // trừ sản phẩm trong kho
      const productInDb = await Product.findOne({ _id: ObjectId(p.idProduct) });
      if (productInDb) {
        const idx = productInDb.color.findIndex(
          (item) => item.name === p.color
        );
        if (idx > -1) {
          const color = productInDb.color[idx];
          const newQuantityInfo = color.quantityInfo.map((q) => {
            if (q.idBranch == idBranch) {
              q.quantity -= p.quantity;
            }
            return q;
          });
          productInDb.color[idx].quantityInfo = newQuantityInfo;
          productInDb.save();
        }
      }
    }

    return {
      data: newOrder,
      success: true,
      message: {
        ENG: "Create Order successfully",
        VN: "Tạo đơn hàng thành công",
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

const getProfitByYear = async (query) => {
  try {
    let { year, idBranch } = query;
    year = ~~year || new Date().getFullYear();
    const queryObj = {
      status: STATUS.DELIVERED,
      updatedAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    };
    if (idBranch) {
      queryObj.idBranch = ObjectId(idBranch);
    }
    const result = await Order.aggregate([
      {
        $match: queryObj,
      },
      {
        $group: {
          _id: {
            month: { $month: "$updatedAt" },
          },
          total: { $sum: "$totalPrice" },
        },
      },
    ]);
    return {
      success: true,
      data: result,
      message: {
        ENG: "Get Profit by year successfully",
        VN: "Lấy doanh thu theo năm thành công",
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

const getTop10BestSellerProduct = async (query) => {
  try {
    let { year, idBranch } = query;
    year = ~~year || new Date().getFullYear();
    const queryObj = {
      status: STATUS.DELIVERED,
      updatedAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    };
    if (idBranch) {
      queryObj.idBranch = ObjectId(idBranch);
    }
    const result = await Order.aggregate([
      {
        $match: queryObj,
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: {
            idProduct: "$products.idProduct",
            name: "$products.name",
            color: "$products.color",
          },
          total: { $sum: "$products.quantity" },
        },
      },
      {
        $sort: { total: -1 },
      },
      {
        $limit: 10,
      },
    ]);
    return {
      success: true,
      data: result,
      message: {
        ENG: "Get top 10 best seller product successfully",
        VN: "Lấy top 10 sản phẩm bán chạy nhất thành công",
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

module.exports = {
  create,
  createForGuest,
  changeStatus,
  cancel,
  filterByBranch,
  getAllByUser,
  getByStatusAndUser,
  getByStatusAndBranch,
  getProfitByYear,
  getTop10BestSellerProduct,
};
