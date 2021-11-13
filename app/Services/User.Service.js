
const { Account, User } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE, ROLE, AUTH_TYPE } = require("../Common/Constants");


// service chỉnh sủa thông tin người dùng
const updateUser = async(idUser,body)=>{
    const {name, phone, address}=body;
   // console.log(`service ${idUser}`);
    try {
        const user =  await User.findOne({_id:idUser});
        if(!user){
            return {
                message: {
                  ENG: "User not found",
                  VN: "User không tồn tại",
                },
                success: false,
                status: HTTP_STATUS_CODE.NOT_FOUND,
              };
        }else{
            user.name =name;
            user.phone=phone;
            var addressNew = {
                detail:address.detail,
                province:address.province,
                address:address.district,
                village:address.village,
            }
            // user.address.detail = address.detail;
            // user.address.province = address.province;
            // user.address.district = address.district;
            // user.address.village = address.village;
            user.address=addressNew;
            await user.save();
            console.log(addressNew);
            return {
                message: {
                    ENG: "Upgrade successful",
                    VN: "Sửa User thành công",
                  },
                  success: true,
                  status: HTTP_STATUS_CODE.OK,
            };
        }
        
    }catch(err){
        return{
            success: false,
            message: err.message,
            status: err.status,
        }
    }
};

const findAllUser = async()=>{
    try{
        const data = await User.find();
        console.log(data.length)
        const dataListUser = [];
        if(data.length == 0)
        {
           return {
            message: {
                ENG: "Not get list User",
                VN: "Lấy tất cả người dùng thất bại",
              },
              success: false,
              status: HTTP_STATUS_CODE.OK,
           }
        }
        else{
            for(let i=0;i<data.length;i++){
                dataListUser.push(data[i]);
            }
            console.log(dataListUser.length)
            return {
                message: {
                    ENG: "Get list User success",
                    VN: "Lấy tất cả người dùng thành công",
                  },
                  data: dataListUser,
                  success: true,
                  status: HTTP_STATUS_CODE.OK,
            }
        }
        
    }catch(err){
        return{
            success: false,
            message: err.message,
            status: err.status,
        }
    }
}

const searchByName= async(query)=>{
    try{
        const searchName = query;
        //console.log(query.name);
        //{ $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
        const data = await User.find( {$or:[ {name:{ $regex: query.name, $options: '$i' }},{phone:{ $regex: query.name, $options: '$i' }}] });
        console.log(query.name);
        const listData=[];
        if(!data){
             return {
                 message: {
                       ENG: "Not search User",
                        VN: "Tìm kiếm người dùng thất bại",
                      },
                      success: false,
                      status: HTTP_STATUS_CODE.OK,
                   }
            
        }else{
            for(let i=0;i<data.length;i++){
                listData.push(data[i]);
            }
            return {
                message: {
                    ENG: "Get list User success",
                    VN: "Lấy tất cả người dùng thành công",
                  },
                  data: listData,
                  success: true,
                  status: HTTP_STATUS_CODE.OK,
            }
        }
    }catch(err){
        return{
            success: false,
            message: err.message,
            status: err.status,
        }
    }
};
module.exports={
    updateUser,
    findAllUser,
    searchByName
}