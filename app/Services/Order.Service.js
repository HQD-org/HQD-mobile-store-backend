const { Cart, Product, Order, Branch } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE, STATUS } = require("../Common/Constants");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

<<<<<<< HEAD


const a = async ({id, color, idBranch, soLuong})=>{
    const product =  await Product.findOne({
        _id:id,
    }
    
    );
    const r =  product.color.map((item)=>{
         if(item.name ===color)
         {
             const quantityInfo = item.quantityInfo.map((quantity)=>{
                 if(quantity.idBranch === idBranch)
                 {
                     quantity.quantity = quantity.quantity - soLuong;
                     return quantity;
                 }
                 return quantity;
             });
             item.quantityInfo = quantityInfo;
             return item;
         }
         return item;
     });
    product.color = r;
    await product.save();
}

const craeteOrder = async(idUser, body)=>{
    try{

        // let {idCart, totalPrice, user, coupon, receiveInfo, status } = body;
        // const cart = await Cart.findOne({user:idUser});
        // if(!cart)
        // {
        //     return {
        //         success: false,
        //         message:{
        //             ENG:"Your cart wasn't exist",
        //             VN:"Giỏ hàng của bạn không tồn tại"
        //         },
        //         status: HTTP_STATUS_CODE.NOT_FOUND
        //     };
        // }
        // const newOrder = new Order({idCart,totalPrice,user,coupon,receiveInfo,status});
        // await newOrder.save();
        // return {
        //     success: true,
        //     message:{
        //         ENG:"Create Order successfully",
        //         VN:"Tạo đơn hàng thành công"
        //     },
        //     status:HTTP_STATUS_CODE.OK
        // }
        let {coupon, receiveInfo, idBranch}=body;
        const cart = await Cart.findOne({user:idUser});
        if(!cart){
            return {
                success: false,
                message:{
                    ENG:"Your cart is empty haven't to checkout",
                    VN:"Giỏ hàng rỗng không được tạo hóa đơn"
                },
                status: HTTP_STATUS_CODE.NOT_FOUND
            }
        }
        const products = cart.products; // lấy list sản phẩm
        let totalPrice = 0; // lấy tổng tiền
        for(const p of products){
            totalPrice = totalPrice + p.price; 
            let quantityP = p.quantity;  
            let colorP = p.color;    
          // trừ sản phẩm trong kho
          const product =  await Product.findOne({
            _id:p.idProduct});
        const r =  product.color.map((item)=>{
             if(item.name ===colorP)
             {
                 const quantityInfo = item.quantityInfo.map((quantity)=>{
                     if(quantity.idBranch === idBranch)
                     {
                         quantity.quantity = quantity.quantity - quantityP;
                         return quantity;
                     }
                     return quantity;
                 });
                 item.quantityInfo = quantityInfo;
                 return item;
             }
             return item;
         });
        product.color = r;
        await product.save();
        }
        const newOrder = new Order({
            products: products,
            totalPrice: totalPrice,
            coupon: coupon,
            user: idUser,
            receiveInfo: receiveInfo,
            status : "wait"
        });
        await newOrder.save();
        return {
            success:true,
            message:{
                ENG:"Create Order successfully",
                VN:"Tạo đơn hàng thành công",
            },
            status:HTTP_STATUS_CODE.OK,
        }

    }catch(err){
        return{
            success: false,
            message: err.message,
            status: err.status,
        };
=======
const create = async (idUser, body) => {
  try {
    const newOrder = await Order.create({ ...body, user: idUser });
    if (!newOrder) {
      return {
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        success: false,
        message: {
          ENG: "Create Order fail",
          VN: "Tạo đơn hàng thất bại",
        },
      };
>>>>>>> 354c29aed8de6e391571a82d3f686dc686110bc2
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

// const getByStatusAndBranch = async (idUser, query) => {
//   try {
//     const account = await Account.findOne({ idUser });
//     const branch = await Branch.findOne({ idManager: account._id });

//   } catch (err) {
//     return {
//       success: false,
//       message: err.message,
//       status: err.status,
//     };
//   }
// };

module.exports = {
  create,
  changeStatus,
  cancel,
  getAllByUser,
  getByStatusAndUser,
};
