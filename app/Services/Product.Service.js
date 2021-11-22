const { MobileModel, Product } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");

// const createProduct = async (body) => {
//   try {
//     const model = await MobileModel.findById(body.idModel);
//     if (!model)
//       return {
//         success: false,
//         message: {
//           ENG: "Mobile model not found",
//           VN: "Không tìm thấy model điện thoại",
//         },
//         status: HTTP_STATUS_CODE.NOT_FOUND,
//       };
//     // const existProduct =  await
//     const product = new Product(body);
//     return {
//       data: newModel,
//       success: true,
//       message: {
//         ENG: "Create Mobile Model successfully",
//         VN: "Tạo model điện thoại thành công",
//       },
//       status: HTTP_STATUS_CODE.OK,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message,
//       status: error.status,
//     };
//   }
// };

const uniqueColor = (arrayColor) => {
  const flags = [],
    uniqueColor = [];
  for (let i = 0; i < arrayColor.length; i++) {
    if (flags[arrayColor[i].name]) continue;
    flags[arrayColor[i].name] = true;
    uniqueColor.push(arrayColor[i]);
  }
  return uniqueColor;
};

const createProduct = async (body)=>{
    try {
      const{name , idModel, capacity, ram,color,status,description} = body;
      console.log(name);
    const model = await MobileModel.findOne({_id:idModel}); // không tìm thấy model
    if(!model){
      return {
        success: false,
        message: {
          ENG: "Model of product not found",
          VN: "Không tìn thấy model của sản phẩm",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    // const productName = await Product.findOne({name:name}); // tên sản phẩm đã được sử dụng
    // if(productName){
    //   return{
    //     success: false,
    //     message:{
    //       ENG: "Name of product is exsit",
    //       VN: "Tên sản phẩm đã tồn tại"
    //     },
    //     status:HTTP_STATUS_CODE.CONFLICT,
    //   };
    // }
    //console.log(color.quantityInfo);
   //color = uniqueColor(color);
    let newProduct = new Product({
      name , idModel, capacity, ram,color,status,description}
    )
    await newProduct.save();
    return {
      success: true,
      message:{
        ENG: "Create Product successfull",
        VN: "Tạo sản phẩm thành công"
      },
      status:HTTP_STATUS_CODE.CONFLICT,
    }
    
    }catch(err){
      return {
        success: false,
        message: err.message,
        status: err.status,
      };
    }
};

module.exports={
  createProduct,
}
