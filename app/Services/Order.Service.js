const { Cart, Product ,  Order, } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");



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
    }
}

const changeStatusOrder = async ( body) =>{
    try{
        const newOrder = await Order.findOneAndUpdate({_id:body.idOrder},body,{new:true});
        if(!newOrder){
            return {
                success:false,
                message:{
                    ENG:"Order not exist",
                    VN:"Hóa đơn không tồn tại",
                },
                status:HTTP_STATUS_CODE.NOT_FOUND
            };
        }
        return {
            success:true,
            message:{
                ENG:"Update status Order successfully",
                VN:"Cập nhật trạng thái đơn hàng thành công"
            },
            status:HTTP_STATUS_CODE.OK,
        }
    }catch(err){
        return{
            success: false,
            message: err.message,
            status: err.status,
        }
    }
}

const deleteOrder = async (idUser, body)=>{
    const order = await Order.findOne({$and:[{user:idUser},{_id:body.idOrder}]});
    if(order.status === "transport"){
        return {
            success:false,
            message:{
                ENG:"Delete Order fail",
                VN:"Xóa đơn hàng thất bại",
            },
            status:HTTP_STATUS_CODE.FORBIDDEN
        };
    }
    await Order.findOneAndUpdate({$and:[{user:idUser},{_id:body.idOrder}]},{$set:{status:"cancel"}},{new:true});
    return {
        success: true,
        message:{
            ENG:"Delete Order successfully",
            VN:"Hủy đơn hàng thành công"
        },
        status:HTTP_STATUS_CODE.OK
    }

}

const getDataOrder = async(idUser, query)=>{
    // lấy tất cả hóa đơn của User theo trạng thái
    try{
        console.log(query.status);
        const result = await Order.aggregate([
            {$match:{$and:[{status:query.status},{user:idUser}]}}
        ]);
        return {
            success:true,
            data:result,
            message:{
                ENG:"Get Order by status successfully",
                VN:"Lấy đơn hàng thành công"
            },
            status:HTTP_STATUS_CODE.OK
        }
    }catch(err){
        return{
            success: false,
            message: err.message,
            status: err.status,
        }
    }
}

module.exports = {
    craeteOrder,
    changeStatusOrder,
    deleteOrder,
    getDataOrder
}