const express = require("express");

const { userRegister, userLogin } = require("../controllers/userController");

const authRoutes = express.Router();

authRoutes.post("/login", userLogin);

authRoutes.post("/register", userRegister);

module.exports = authRoutes;
