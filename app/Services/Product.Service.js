const { MobileModel, Product, MobileBrand } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const { mapToRegexContains } = require("../Common/Helper");
const mongoose = require('mongoose');
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
      status:HTTP_STATUS_CODE.OK,
    }
    
    }catch(err){
      return {
        success: false,
        message: err.message,
        status: err.status,
      };
    }
};

const updateProduct = async (body)=>{
  try{
    const productMongoDB = await Product.findOne({_id:body.id});
    if(!productMongoDB){
      return {
        success:false,
        message:{
          ENG:"Product not exist",
          VN:"Sản phẩm không tồn tại"
        },
        status:HTTP_STATUS_CODE.NOT_FOUND
      }
    }
    const newProduct = await Product.findOneAndUpdate({_id:body.id},body,{new :true});
    if(!newProduct){
      return {
        success:false,
        message:{
          ENG:"Product not exist",
          VN:"Sản phẩm không tồn tại",
        },
        status:HTTP_STATUS_CODE.NOT_FOUND
      }
    }
    return {
      success:true,
        message:{
          ENG:"Update product successfull",
          VN:"Sửa sản phẩm thành công"
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

const getDataProduct = async (query)=>{
  try{
    const product = await Product.findOne({_id:query.id});
    if(!product){
      return{
        success: false,
        message:{
          ENG:"Product not exist",
          VN:"Sản phẩm không tồn tại",
        },
        status:HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    const model = await MobileModel.findOne({_id:product.idModel});
    if(!model){
      return {
        success: false,
        message:{
          ENG:"Model not exist",
          VN:"Model không tồn tại",
        },
        status:HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    const dataProduct = await Product.findOne({_id:query.id}).populate('idModel');
    console.log(dataProduct);
    return {
      success: true,
      data:{
        product:product,
        model:model,
      },
      message:{
        ENG:"Get data successfull",
        VN:"lấy thông tin sản phẩm thành công",
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

const getAllData = async ()=>{
  try {
   // const getAll1 = await Product.find().lean();
   //const list =  await Promise.all(getAll1.map(async e=>{return {...e,model:await MobileModel.findById(e.idModel).lean() };}));
    const getAll = await Product.find({}).populate('idModel');
    if(getAll.length==0)
    {
      return {
        success: false,
        message:{
          ENG:"getAll data product fail",
          VN:"Lấy dữ liệu tất cả sản phẩm fail",
        },
        status:HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    return {
      success: true,
      data: getAll,
      message:{
        ENG:"getAll data product Success",
        VN:"Lấy dữ liệu tất cả sản phẩm thành công",
      },
      status:HTTP_STATUS_CODE.OK,
    };
  }catch(err){
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
}

const filterByBrand = async (query)=>{
  try{
    const dataBrand = await MobileBrand.find().lean();
    const idBrandCast = mongoose.Types.ObjectId(query.idBrand);
    const dataModel = await MobileModel.find({}).populate('idBrand');
    //console.log(dataModel);
    const list =[]; // list ID của model theo Brand đã truyền
    const listProduct = [];
    if(!dataBrand){
      return {
        success: false,
        message: {
          ENG:"Brand is not Exist",
          VN:"Hãng không tồn tại"
        },
        status:HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    for(let i=0;i<dataModel.length;i++)
    {
      list.push(dataModel[i]._id);
    }
    for(const IdModel of list)
    {
     // console.log(IdModel)
     //const idCast =  mongoose.Types.ObjectId(IdModel);
      const resultMobileModel = await MobileModel.findById( IdModel).lean();
      const resultProduct = await Product.find({idModel:IdModel});
      // console.log(resultMobileModel);
      //listProduct.push({...product,model:resultMobileModel});
      listProduct.push({...resultMobileModel,product:resultProduct});
    }
    return{
      success: true,
      data: listProduct,
      message: {
        ENG:"Get data product by Brand success",
        VN:"Lấy dữ liệu sản phẩm theo Brand thành công",
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

const fliter = async(query)=>{
  let { idBrand, name, itemPerPage, page, ...remainQuery } = query;
  itemPerPage = ~~itemPerPage || 12;
  page = ~~page || 1;
  mapToRegexContains(remainQuery);
  const queryObj = {
    ...remainQuery,
  };
  if (idBrand) queryObj.idBrand = new RegExp("^" + idBrand + "$", "i");
  if (name) {
    queryObj.name = new RegExp(name, "i");
  }
  const products =  await Product.find(queryObj)
  .populate({path: 'idModel',}).populate( {path: 'idBrand' })
  .skip(itemPerPage * page - itemPerPage)
  .limit(itemPerPage);
  const totalItem = await Product.find(queryObj).countDocuments();
  return {
    success:true,
    data:{
      products,
      pagination: { itemPerPage, page, totalItem }
    },
    message: {
      ENG: "Find successfully",
      VN: "Tìm kiếm thành công",
    },
    status: HTTP_STATUS_CODE.OK,
  };

}


module.exports={
  createProduct,
  updateProduct,
  getDataProduct,
  getAllData,
  filterByBrand,
  fliter
}
