const dotenv = require("dotenv");
const result = dotenv.config({
  path: ".env",
});

// if (result.error) {
//   throw result.error;
// }
// console.log(result);
module.exports = { ...process.env };
