const express = require("express");
const morgan = require("morgan");
const { statusRoutes } = require("./routes");

const app = express();
app.use(express.json());

process.env.NODE_ENV === "development" && app.use(morgan("dev"));

app.use("/api/v1/status", statusRoutes);

module.exports = app;
