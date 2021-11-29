const { Cart, Product ,MobileModel} = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const { mapToRegexContains } = require("../Common/Helper");
const mongoose = require('mongoose');


// Các API của cart

//1) Add To Cart: http://localhost:8080/cart/add-to-cart  (idUser (token), idProduct);
//2) Update cart: http://localhost:8080/cart/update-cart (idUser (token), idProduct, quantity);
//3) Delete cart: http://localhost:8080/cart/delete-cart (idUser (token), idProduct);
//4) get list product in cart: 


const addTocart = async(idUser,body)=>{
    // Trường hợp này bắt đăng nhập
    // khởi tạo cart khi người dùng bấm nút "Add to cart"
    // Đồng thời thêm sản phẩm vào giỏ hàng với số lượng ban đầu là 1
    try{
        let {idProduct,color,image} = body;
        const cart = await Cart.findOne({user:idUser}); 
        if(cart){
            // nếu cart đã tồn tại trước đó
            // kiểm tra nếu sản phẩm tồn tại trong giỏ hàng
            //console.log(productExistInCart);
            let counter=0;
            for(let i=0;i<cart.products.length;i++)
            {
                if(cart.products[i].idProduct == idProduct){
                    return {
                        success:false,
                        message:{
                            ENG:"Product is Exist in your cart",
                            VN:"Sản phẩm đã có trong giỏ hàng",
                        },
                        status: HTTP_STATUS_CODE.CONFLICT,
                    }
                }
                else if(cart.products[i].idProduct != idProduct){
                    counter= counter +1;
                }
            }
            // Thêm sản phẩm mới khác với những sản phẩm đã tồn tại trong giỏ hàng
            if(counter>0)
            {
                const P = await Product.findOne({_id:idProduct});
                const newProduct = {
                    idProduct:idProduct,
                    quantity:~~1,
                    price: ~~P.color[0].price,  
                    color:color.trim(),
                    image:image,
                }
                cart.products.push(newProduct);
                await cart.save();
                return {
                    success:true,
                    message:{
                        ENG:"Add to cart successfull",
                        VN:"Thêm vào giỏ hàng thành công"
                    },
                    status:HTTP_STATUS_CODE.OK
                }
            }
        }
        // nếu cart chưa tồn tại tạo mới cart
        const product = await Product.findOne({_id:idProduct});
        const pro = {
            idProduct:idProduct,
            quantity:~~1,
            price: ~~product.color[0].price,  
            color:color.trim(),
            image:image
        };
        const newCart = new Cart({products:pro,user:idUser,status:'active'});
        await newCart.save();
        return {
            success:true,
            message:{
                ENG:"Add to cart successfull",
                VN:"Thêm vào giỏ hàng thành công"
            },
            status:HTTP_STATUS_CODE.OK
        }
    }catch(err){
        return {
            success: false,
            message: err.message,
            status: err.status,
          };
    }
}

const updateCart = async(idUser,body)=>{
    try{
        let {quantity,idProduct}=body;
        const cart = await Cart.findOne({user:idUser});
        //console.log(cart);
        // const productOfCart = cart['products'];
        if(!cart)
        {
            return {
                success:false,
                message:{
                    ENG:"Cart not exist",
                    VN:"Giỏ hàng không tồn tại",
                },
                Status:HTTP_STATUS_CODE.NOT_FOUND
            }
        }
        // for(let i =0;i<cart.products.length;i++)
        // {
        //     if(cart.products[i].idProduct == idProduct)
        //     {
        //         cart.products[i].quantity = quantity;
        //         await cart.save();
        //     }
        // }
        const query = {user:idUser,"products.idProduct":idProduct};
        const dataUpdate = {$set:{"products.$.quantity":quantity}};
        const result = await Cart.updateOne(query,dataUpdate);
        if(!result)
        {
            return {
                success:false,
                message:{
                    ENG:"Update cart success",
                    VN:"Cập nhật giỏ hàng thành công",
                },
                Status:HTTP_STATUS_CODE.FORBIDDEN
            };
        }
        return {
            success:true,
            message:{
                ENG:"Update cart success",
                VN:"Cập nhật giỏ hàng thành công",
            },
            Status:HTTP_STATUS_CODE.OK
        };
    }catch(err){
        return {
            success: false,
            message: err.message,
            status: err.status,
          };
    }
}

const deleteProductInCart = async(idUser, body) =>{
    try{
        let {idProduct} = body;
        const cart = await Cart.findOne({user:idUser});
        if(!cart)
        {
            return {
                success:false,
                message:{
                    ENG:"Cart not exist",
                    VN:"Giỏ hàng không tồn tại",
                },
                Status:HTTP_STATUS_CODE.NOT_FOUND
            }
        }
        //const result = await Cart.updateOne({user:idUser},{$unset:{"products.0":1}});
       const result = await Cart.updateOne({user:idUser},{$pull:{products:{idProduct:idProduct}}});
       if(!result)
       {
        return {
            success:false,
            message:{
                ENG:"Cart not exist",
                VN:"Giỏ hàng không tồn tại",
            },
            Status:HTTP_STATUS_CODE.NOT_FOUND
        }
       }
       return {
        success:true,
        message:{
            ENG:"Delete product cart success",
            VN:"Xóa sản phẩm khỏi giỏ hàng thành công",
        },
        Status:HTTP_STATUS_CODE.OK
    };

    }catch(err){
        return {
            success: false,
            message: err.message,
            status: err.status,
          };
    }
}

const getProductInCart = async(idUser)=>{
    try{
    //     const productsCart = await Cart.find({user:idUser})
    //     .populate({path:'products.idProduct'});
    //     //.populate({path:'idModel',math:{idModel:productsCart.$.idProduct.idModel}})
    //    // console.log(productsCart[0].products[0].idProduct.idModel);
    //    const listProducts = [];
      
    //    for(let i=0;i<productsCart[0].products.length;i++)
    //    {
    //         const dataModel = await MobileModel.findOne({_id:productsCart[0].products[i].idProduct.idModel});
    //         listProducts.push({dataCart: productsCart[0].products[i],Model:dataModel});
    //    }
       
    //     if(!productsCart){
    //         return{
    //             success:false,
    //             message:{
    //                 ENG:"Your cart  is empty",
    //                 VN:"Chưa có sản phẩm trong giỏ hàng"
    //             },
    //             status:HTTP_STATUS_CODE.NOT_FOUND
    //         };
    //     }
        const listProducts = await Cart.aggregate([
            {
                $match:{user:idUser}
            },
            {
                $unwind:{
                path:'$products',
                preserveNullAndEmptyArrays: true,
            }},
            {
                $project:{
                    createdAt:0,
                    updatedAt:0
                }
            },
            {
                $lookup:{
                    from:"products",
                    localField:"products.idProduct",
                    foreignField:"_id",
                    as:"dataProduct"
                } 
            },
            {
                $project:{
                    "dataProduct.createdAt":0,
                    "dataProduct.updatedAt":0,
                    "dataProduct.color.createdAt":0,
                    "dataProduct.color.updatedAt":0,
                }
            },
           
        ]);
        
        const newListProduct = listProducts.map((item)=>{
            const fliterColor = item.products.color;
           const listdataProduct = item.dataProduct[0].color.filter((color)=>{
               return color.name === fliterColor
            });
            return {
                ...item,
                dataProduct:{
                    ...item.dataProduct[0],color:listdataProduct
                }
            }
        });

        return {
            success:true,
            data:newListProduct,
            message:{
                ENG:"Get products in your cart success",
                VN:"Lấy sản phẩm trong cart thành công"
            },
            status:HTTP_STATUS_CODE.OK
        };
    }catch(err){
        return {
            success: false,
            message: err.message,
            status: err.status,
          };
    }
}

module.exports={
    addTocart,
    updateCart,
    deleteProductInCart,
    getProductInCart
}