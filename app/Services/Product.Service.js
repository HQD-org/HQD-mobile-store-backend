const { MobileModel, Product } = require("../Models/Index.Model");

const createProduct = async (body) => {
  try {
    const model = await MobileModel.findById(body.idModel);
    if (!model)
      return {
        success: false,
        message: {
          ENG: "Mobile model not found",
          VN: "Không tìm thấy model điện thoại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    // const existProduct =  await
    const product = new Product(body);
    return {
      data: newModel,
      success: true,
      message: {
        ENG: "Create Mobile Model successfully",
        VN: "Tạo model điện thoại thành công",
      },
      status: HTTP_STATUS_CODE.OK,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};
