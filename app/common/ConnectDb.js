const mongoose = require("mongoose");
const { MONGODB_URI } = require("./Config");

const connectDb = async () => {
  await mongoose
    .connect(MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Success!!!!"))
    .catch((error) => console.error("Failed: ", error));
};

module.exports = connectDb;
