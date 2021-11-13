
const {Branch} = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");


// hàm tạo Branch
const createBranch=async(body)=>{
    try{
        const {name,status,address}=body;
        const BranchExist = await Branch.findOne({name:name});
       
        if(BranchExist){
            return{
                success: false,
                message: {
                  ENG: "Name Branch has been used",
                  VN: "Tên chi nhánh đã được sử dụng",
                },
                status: HTTP_STATUS_CODE.CONFLICT,
            };
        }
        const newBranch = new Branch({
            name,address,status
        });
        await newBranch.save();
        return {
            data: newBranch,
            success: true,
            message: {
              ENG: "Create Branch successful",
              VN: "Tạo chi nhánh thành công",
            },
            status: HTTP_STATUS_CODE.CREATE,
          };
    }catch(err){
        return {
            success: false,
            message: err.message,
            status: err.status,
          };
    }
}

// hàm getAllBranch
const getAllBranch= async()=>{
    try{
        const dataBranch = await Branch.find();
        const dataListBranch =[];
        if(dataBranch.length==0){
          return {
            message: {
                ENG: "Not get list Branch",
                VN: "Lấy tất cả chi nhánh",
              },
              success: false,
              status: HTTP_STATUS_CODE.OK,
          };
        }
        else{
            for(let i=0;i<dataBranch.length;i++)
            {
                dataListBranch.push(dataBranch[i]);
            }
            return {
                message: {
                    ENG: "Get list Branch success",
                    VN: "Lấy tất cả chi nhánh thành công",
                  },
                  data: dataListBranch,
                  success: true,
                  status: HTTP_STATUS_CODE.OK,
            };
        }
    }catch(err){
        return {
            success: false,
            message: err.message,
            status: err.status,
          };
    }
}

// hàm chỉnh sửa thông tin của brand

const updateBranch = async(body)=>{
    try{
        const {id,name, address,status} = body;
        console.log(body);
        const branch = await Branch.findOne({_id:id});
        if(!branch){
            return{
                message: {
                    ENG: "Branch not found",
                    VN: "Branch không tồn tại",
                  },
                  success: false,
                  status: HTTP_STATUS_CODE.NOT_FOUND,
            };
        }
        else{
            branch.name = name;
            branch.status = status;
            var addressNew = {
                detail:address.detail,
                province:address.province,
                address:address.district,
                village:address.village,
            };
            branch.address = addressNew;
            await branch.save();
            return {
                message: {
                    ENG: "Upgrade successful",
                    VN: "Sửa Branch thành công",
                  },
                  success: true,
                  status: HTTP_STATUS_CODE.OK,
            }
        }
    }catch(err){
        return{
            success: false,
            message: err.message,
            status: err.status,
        };
    }
}

// hàm tìm kiếm Branh theo tên và status

const searchBranch = async(query)=>{

    try{
        const dataBranch = await Branch.find({$or:[ {name:{ $regex: query.name, $options: '$i' }},{status:{ $regex: query.name, $options: '$i' }}] });
        const listData=[];
        console.log(query);
        if(!dataBranch){
           return {
            message: {
                ENG: "Not search Branch",
                 VN: "Tìm kiếm Branch thất bại",
               },
               success: false,
               status: HTTP_STATUS_CODE.OK,
            };
           
        }
        else{
            for(let i=0;i<dataBranch.length;i++){
                listData.push(dataBranch[i]);
            }
            return {
                message:{
                    ENG:"Search Branch Successful",
                    VN:"Tìm kiếm Branch thành công",
                },
                data:listData,
                success:true,
                status:HTTP_STATUS_CODE.OK,
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

module.exports={
    createBranch,
    getAllBranch,
    updateBranch,
    searchBranch
}