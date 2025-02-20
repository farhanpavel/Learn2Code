const express = require("express");
const {
  questionresultGet,
  questionresultGetByid,
  questionresultDelete,
} = require("../controllers/questionReusltController");
const { jwtAuthentication } = require("../middlewares/authMiddleware");

const questionresultRoutes = express.Router();
questionresultRoutes.get(
  "/question/data",
  jwtAuthentication,
  questionresultGet
);
questionresultRoutes.get(
  "/question/data/:title",
  jwtAuthentication,
  questionresultGetByid
);
questionresultRoutes.delete(
  "/question/data/:title",
  jwtAuthentication,
  questionresultDelete
);

module.exports = questionresultRoutes;
