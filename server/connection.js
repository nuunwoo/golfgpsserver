const mysql = require("mysql");
// const timer = require("./module/timer").timer();
const timer = require("./modules/timer").timer;

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
var conn = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
};

let connection;
module.exports.connection = connection;

const handleDisconnect = () => {
  connection = mysql.createConnection(conn); // 커넥션 생성
  connection.connect((err) => {
    console.log(`${timer.getCurrentTime()}] db connection`);
    setInterval(() => {
      connection.query("select 1", (err, row) => {
        if (err) console.log(err);
        else return;
      });
    }, 6000); // 6초마다 실행
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); //연결 실패시 2초 후 다시 연결
    }
  });

  connection.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("MySql_DBError) PROTOCOL_CONNECTION_LOST");
      handleDisconnect(); //연결 오류시 호출하는 재귀함수
    } else {
      console.log("MySql_DBError)", err);
      throw err;
    }
  });
};
module.exports.handleDisconnect = handleDisconnect;
// handleDisconnect(); //require과 동시에 실행됨

//connection 현재상태의 connection 객체를 반환하는 함수를 export함.
module.exports.getConnection = () => {
  return connection;
};
