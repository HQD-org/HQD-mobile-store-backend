const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const createSchema = (schema) => {
  const model = new Schema(schema, { timestamps: true });
  return model;
};

module.exports = { createSchema };
