"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.CLIENT_PORT;
let isDisableKeepAlive = false;
app.use((req, res, next) => {
  if (isDisableKeepAlive) {
    res.set("Connection", "close");
  }
  next();
});
app.use(express.static(path.join(__dirname, "./dist")));
app.use("/", express.static(path.join(__dirname, "./dist/index.html")));
app.use("*", express.static(path.join(__dirname, "./dist/index.html")));
const server = app.listen(PORT, () => {
  if (process.send) process.send("ready");
  console.log(PORT);
});
process.on("SIGINT", () => {
  isDisableKeepAlive = true;
  server.close(() => {
    console.log("server closed");
    process.exit(0);
  });
});
