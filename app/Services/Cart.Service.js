const { Cart, Product } = require("../Models/Index.Model");
const { HTTP_STATUS_CODE } = require("../Common/Constants");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// cart service voi role user (da dang nhap)
const addToCart = async (idUser, body) => {
  // thêm sản phẩm vào giỏ hàng với số lượng là 1
  try {
    const { idProduct, color, image } = body;
    const productInDb = await Product.findById(idProduct);

    if (!productInDb) {
      return {
        success: false,
        message: {
          ENG: "Product not exist",
          VN: "Sản phẩm không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    let cart = await Cart.findOne({ user: idUser });
    if (cart) {
      // nếu cart đã tồn tại trước đó
      // kiểm tra nếu sản phẩm tồn tại trong giỏ hàng
      const isInCart = cart.products.findIndex(
        (product) => product.idProduct == idProduct && product.color === color
      );
      if (isInCart !== -1) {
        cart.products[isInCart].quantity += 1;
        await cart.save();
        return {
          success: true,
          message: {
            ENG: "Add to cart successfull",
            VN: "Thêm vào giỏ hàng thành công",
          },
          status: HTTP_STATUS_CODE.OK,
          data: cart,
        };
      }
    }

    const colorProduct = productInDb.color.find((c) => c.name === color);
    if (colorProduct) {
      const newItem = {
        idProduct,
        quantity: 1,
        price: colorProduct.price,
        color,
        image,
        name: productInDb.name,
      };

      if (cart) {
        // cart ton tai nhung khong co san pham nay trong gio hang
        cart.products.push(newItem);
        await cart.save();
      } else {
        // cart khong ton tai
        cart = await Cart.create({
          products: [newItem],
          user: idUser,
          status: "active",
        });
      }
      return {
        success: true,
        message: {
          ENG: "Add to cart successfull",
          VN: "Thêm vào giỏ hàng thành công",
        },
        status: HTTP_STATUS_CODE.OK,
        data: cart,
      };
    }
    return {
      success: false,
      message: {
        ENG: "Color not exist",
        VN: "Màu sắc không tồn tại",
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

const updateCart = async (idUser, body) => {
  try {
    const { quantity, idProduct, color } = body;
    const productInDb = await Product.findById(idProduct);
    if (!productInDb) {
      return {
        success: false,
        message: {
          ENG: "Product not exist",
          VN: "Sản phẩm không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }

    const colorProduct = productInDb.color.find((c) => c.name === color);
    if (!colorProduct) {
      return {
        success: false,
        message: {
          ENG: "Color not exist",
          VN: "Màu sắc không tồn tại",
        },
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }

    if (colorProduct.quantityInfo.every((q) => q.quantity < quantity)) {
      return {
        success: false,
        message: {
          ENG: "Quantity not enough",
          VN: "Số lượng không đủ",
        },
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }

    const cart = await Cart.findOneAndUpdate(
      {
        user: idUser,
        products: { $elemMatch: { idProduct, color } },
      },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );
    if (!cart) {
      return {
        success: false,
        message: {
          ENG: "Cart not exist",
          VN: "Giỏ hàng không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    return {
      success: true,
      message: {
        ENG: "Update cart successfully",
        VN: "Cập nhật giỏ hàng thành công",
      },
      status: HTTP_STATUS_CODE.OK,
      data: cart,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
};

const deleteProductInCart = async (idUser, body) => {
  try {
    const { idProduct, color } = body;
    const cart = await Cart.findOneAndUpdate(
      { user: idUser },
      {
        $pull: {
          products: { $and: [{ idProduct }, { color }] },
        },
      },
      { new: true }
    );
    if (!cart) {
      return {
        success: false,
        message: {
          ENG: "Cart not exist",
          VN: "Giỏ hàng không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }
    return {
      success: true,
      message: {
        ENG: "Delete product cart success",
        VN: "Xóa sản phẩm khỏi giỏ hàng thành công",
      },
      status: HTTP_STATUS_CODE.OK,
      data: cart,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
};

const getProductInCart = async (idUser) => {
  try {
    const listProducts = await Cart.aggregate([
      {
        $match: { user: idUser },
      },
      {
        $unwind: {
          path: "$products",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.idProduct",
          foreignField: "_id",
          as: "dataProduct",
        },
      },
      {
        $project: {
          "dataProduct.createdAt": 0,
          "dataProduct.updatedAt": 0,
          "dataProduct.color.createdAt": 0,
          "dataProduct.color.updatedAt": 0,
        },
      },
    ]);

    const newListProduct = listProducts.map((item) => {
      const filterColor = item.products.color;
      const listDataProduct = item.dataProduct[0].color.filter((color) => {
        return color.name === filterColor;
      });
      return {
        ...item,
        dataProduct: {
          ...item.dataProduct[0],
          color: listDataProduct,
        },
      };
    });

    return {
      success: true,
      data: newListProduct,
      message: {
        ENG: "Get products in your cart success",
        VN: "Lấy sản phẩm trong cart thành công",
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

const getCart = async (idUser) => {
  try {
    const cart = await Cart.aggregate([
      {
        $match: { user: ObjectId(idUser) },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.idProduct",
          foreignField: "_id",
          as: "dataProduct",
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          "dataProduct.createdAt": 0,
          "dataProduct.updatedAt": 0,
          "dataProduct.color.createdAt": 0,
          "dataProduct.color.updatedAt": 0,
        },
      },
    ]);

    return {
      success: true,
      data: cart.length > 0 ? cart[0] : [],
      message: {
        ENG: "Get cart success",
        VN: "Lấy giỏ hàng thành công",
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

// cart service voi role guest (chua dang nhap)

const updateCartGuest = async (body) => {
  try {
    const { quantity, idProduct, color } = body;
    const productInDb = await Product.findById(idProduct);
    if (!productInDb) {
      return {
        success: false,
        message: {
          ENG: "Product not exist",
          VN: "Sản phẩm không tồn tại",
        },
        status: HTTP_STATUS_CODE.NOT_FOUND,
      };
    }

    const colorProduct = productInDb.color.find((c) => c.name === color);
    if (!colorProduct) {
      return {
        success: false,
        message: {
          ENG: "Color not exist",
          VN: "Màu sắc không tồn tại",
        },
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }

    if (colorProduct.quantityInfo.every((q) => q.quantity < quantity)) {
      return {
        success: false,
        message: {
          ENG: "Quantity not enough",
          VN: "Số lượng không đủ",
        },
        status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      success: true,
      message: {
        ENG: "Update cart successfully",
        VN: "Cập nhật giỏ hàng thành công",
      },
      status: HTTP_STATUS_CODE.OK,
      data: productInDb,
    };
  } catch {
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
};

// merge cart cua guest vao tai khoan dang nhap
const mergeCart = async (idUser, body) => {
  try {
    let cart = await Cart.findOne({ user: idUser });
    if (!cart) {
      cart = new Cart({
        user: idUser,
        products: body.products,
      });
    } else {
      cart.products = body.products;
    }
    await cart.save();
    return {
      success: true,
      message: {
        ENG: "Merge cart successfully",
        VN: "Gộp giỏ hàng thành công",
      },
      status: HTTP_STATUS_CODE.OK,
      data: cart,
    };
  } catch {
    return {
      success: false,
      message: err.message,
      status: err.status,
    };
  }
};

module.exports = {
  addToCart,
  updateCart,
  updateCartGuest,
  deleteProductInCart,
  getProductInCart,
  getCart,
  mergeCart,
};
