const multer = require("multer");
let saveFolder = "";
const multerConfig = {
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype != "image/png" &&
      file.mimetype != "image/jpg" &&
      file.mimetype != "image/jpeg"
    ) {
      cb(null, false);
    } else cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 10124 },
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `Uploads/${saveFolder}/`);
  },
  filename: (req, file, cb) => {
    let extension = "";
    if (file.originalname.split(".").length > 1) {
      extension = file.originalname.substring(
        file.originalname.lastIndexOf(".")
      );
    }
    cb(null, file.fieldname + "-" + Date.now() + extension);
  },
});

const saveImage = (file, folder, options) => {
  saveFolder = folder;
  if (options)
    return multer({
      storage,
      ...multerConfig,
    }).array(file, 10);
  return multer({
    storage,
    ...multerConfig,
  }).single(file);
};

module.exports = {
  saveImage,
  storage,
};
