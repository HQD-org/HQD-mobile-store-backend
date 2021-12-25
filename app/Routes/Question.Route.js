const controller = require("../Controllers/Question.Controller");
const express = require("express");
const { validateQuery } = require("../Validations/Validation");
const { schema } = require("../Validations/Question.Validation");
//const { verifyToken } = require("../Middlewares/Token.Middleware");
const router = express.Router();

router.route("/create").post(controller.handleCreateQuestion);
router.route("/update").post(controller.handleUpdateQuestion);
router
  .route("/filter")
  .get([validateQuery(schema.search)], controller.handleFilterQuestion);
router.route("/get-all").get(controller.handleGetAll);
module.exports = router;
