const fs = require("fs");

const removeFile = (path) => {
  fs.unlink(path, function (err) {
    if (err) return false;
    console.log(
      `log at ==> StorageEngine.js ==> removeFile func ==> File deleted`
    );
  });
};

module.exports = removeFile;
