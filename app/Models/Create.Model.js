const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const createSchema = (schema) => {
  return new Schema(schema, { timestamps: true });
};

module.exports = { createSchema };
