const JWT = require("jsonwebtoken");
const { JWT_SECRET, JWT_ISS } = require("../Common/Config");
const { HTTP_STATUS_CODE } = require("../Common/Constants");

const encodedToken = (idUser) => {
  return JWT.sign(
    {
      iss: JWT_ISS,
      id: idUser,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    JWT_SECRET
  );
}; //done

const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    console.log(`log at: => Token.Service.js => line 20 => header: `, header);
    if (!header) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        message: "Unauthorized: No token found",
        access: false,
      });
    }
    const token = header.split(" ")[1];
    JWT.verify(token, JWT_SECRET, (error, decodedFromToken) => {
      if (error) {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
          message: "Unauthorized",
          access: false,
        });
      } else {
        req.body.token = decodedFromToken;
        next();
      }
    });
  } catch (error) {
    return res.status(error.status).json({
      message: error.message,
      access: false,
    });
  }
}; //done

module.exports = {
  encodedToken,
  verifyToken,
};
