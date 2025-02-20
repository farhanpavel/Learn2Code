const express = require("express");

const {
  userRegister,
  userLogin,
  RefreshToken,
} = require("../controllers/userController");

const authRoutes = express.Router();

authRoutes.post("/login", userLogin);

authRoutes.post("/register", userRegister);
authRoutes.post("/refresh-token", RefreshToken);

module.exports = authRoutes;
