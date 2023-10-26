require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index");
const timer = require("./modules/timer").timer;
const routes = require("./routes");
const wsModule = require("ws");

const PORT = process.env.SERVER_PORT;

const corsOptions = {
  exposedHeaders: ["set-cookie"],
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);

process.send = process.send || function () {};

// 서버 실행
const server = http
  .createServer(app, (req, res) => {
    res.end(`Hi, I'm cluster`);
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  })
  .listen(PORT, () => process.send("ready"));
console.log("worker: ", process.pid);

const wepSocket = require("./socket").wepSocket;

// ws모듈 생성
const webSocketServer = new wsModule.Server({
  server: server,
});
wepSocket(webSocketServer); // websocket 호출

app.use("/", routes); // route 사용
