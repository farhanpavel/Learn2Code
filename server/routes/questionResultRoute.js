const express = require("express");
const {
  questionresultGet,
  questionresultGetByid,
  questionresultDelete,
} = require("../controllers/questionReusltController");

const questionresultRoutes = express.Router();
questionresultRoutes.get("/question/data", questionresultGet);
questionresultRoutes.get("/question/data/:id/:title", questionresultGetByid);
questionresultRoutes.delete("/question/data/:id/:title", questionresultDelete);

module.exports = questionresultRoutes;
