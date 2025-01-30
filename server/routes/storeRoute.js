const express = require("express");

const { storeGet, storePost } = require("../controllers/storeController");

const storeRoutes = express.Router();
storeRoutes.get("/store", storeGet);
storeRoutes.post("/store", storePost);

module.exports = storeRoutes;
