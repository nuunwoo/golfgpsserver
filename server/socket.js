const timer = require("./modules/timer").timer;

// websocket 생성
module.exports.wepSocket = (server) => {
  const clients = new Set(); // 접속한 모바일관제 배열
  const gPad = new Set(); // 접속한 GPad 배열

  // 접속시
  server.on("connection", (ws, request) => {
    const ip =
      request.headers["x-forwarded-for"] || request.connection.remoteAddress;
    let type = "client"; // 접속한 타입
    if (request.headers.pragma) {
      clients.add(ws);
      type = "client";
      if (ws.readyState === ws.OPEN) {
        // 연결 여부 체크
        ws.send("connection");
      }
    } else {
      // if (gPad.size > 0) for (let gpad of gPad) gPad.delete(gpad);
      gPad.add(ws);
      type = "gpad";
    }

    console.log(`${timer.getCurrentTime()}] ${type} connerct`);

    // 메세지 수신
    ws.on("message", (msg) => {
      const data = `${msg}`; // 패킷내용
      // console.log(data); // 디버깅시 주석 제거

      // gpad <-> 모바일 관제 패킷 전송
      if (
        (data.split("|")[0] === "007" || data.split("|")[0] === "017") &&
        gPad.size > 0
      ) {
        for (let gpad of gPad) gpad.send(data);
      } else {
        if (data.split("|")[0] !== "007" && data.split("|")[0] !== "017") {
          for (let client of clients) client.send(data);
        }
      }
    });

    ws.on("error", (error) => {
      console.log(`${timer.getCurrentTime()}] error : ${error}`);
    });

    ws.on("close", () => {
      console.log(`${timer.getCurrentTime()}] ${type} close`);
      if (ws === gPad) for (let gpad of gPad) gPad.delete(gpad);
    });
  });
};
