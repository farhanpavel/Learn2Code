const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoute");
const pdfRoutes = require("./routes/pdfRoute");
const storeRoutes = require("./routes/storeRoute");
const extractRoutes = require("./routes/extractRoute");
const ansRoutes = require("./routes/ansRoute");
const resultRoutes = require("./routes/resultRoute");
const plannerRoute = require("./routes/planner");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Failed to connect to database");
  });

app.listen(PORT, () => {
  console.log(`App is Listening on Port ${PORT}`);
});

// Base route
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api", aiRoutes);
app.use("/api", storeRoutes);
app.use("/api", pdfRoutes);
app.use("/api", extractRoutes);
app.use("/api", ansRoutes);
app.use("/api", resultRoutes);
app.use("/api",plannerRoute);
