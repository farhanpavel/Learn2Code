const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const { userSchema } = require("../models/userSchema");
const User = mongoose.model("user", userSchema);

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const registeredUser = await User.findOne({ email });
  if (registeredUser) {
    return res.status(404).json("user Exist");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  newUser.save();
  res.status(201).json({ message: "User Registered SuccessFully" });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await User.findOne({ email });
  if (!data) {
    return res.status(404).json("user Doesnot Exist");
  }
  const isMatch = await bcrypt.compare(password, data.password);
  if (!isMatch) {
    res.status(404).json("Password Not Match");
  }
  const token = generateToken(data);
  res.status(200).json(token);
};

const RefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json("access Denied");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json("Invalid Refresh TOken");
    }
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json(accessToken);
  });
};

module.exports = {
  userLogin,
  userRegister,
  RefreshToken,
};
