const { Cart, Product, Order, Branch } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE, STATUS } = require("../Common/Constants");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const create = async (idUser, body) => {
  try {
  body.receiveInfo.status = "cod";
    const newOrder = await Order.create({
      ...body,
      user: idUser,
      idBranch: body.idBranch || "61a23e0527b5b90016616975",
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
    // chon chi nhanh tru so luong san pham, kho qua lam random tam :)))
    for (const p of body.products) {
      // trừ sản phẩm trong kho
      await Product.findOneAndUpdate(
        {
          _id: ObjectId(p.idProduct),
          color: {
            $elemMatch: {
              name: p.color,
              quantityInfo: {
                $elemMatch: {
                  quantity: { $gte: p.quantity },
                  idBranch: body.idBranch
                    ? ObjectId(body.idBranch)
                    : ObjectId("61a23e0527b5b90016616975"),
                },
              },
            },
          },
        },
        {
          $inc: { "color.$.quantityInfo.$[].quantity": -p.quantity },
        }
      );
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

module.exports = {
  create,
  changeStatus,
  cancel,
  filterByBranch,
  getAllByUser,
  getByStatusAndUser,
  getByStatusAndBranch,
};
