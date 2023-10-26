const connect = require("../../connection");
const url = require("url");
const timer = require("../../modules/timer").timer;

exports.info = (req, res, next) => {
  handleDisconnect();
  res.sendStatus(200);
};

exports.userInfo = (req, res, next) => {
  // 전체 사용자 정보 받기
  if (!connect.getConnection()) connect.handleDisconnect();
  connect
    .getConnection()
    .query(
      `SELECT * FROM gu0100 WHERE USE_YN = 'Y' ORDER BY user_div, name asc;`,
      [req.query.co_div],
      (err, row) => {
        if (err) console.log(err);
        else {
          res.send({ name: req.query.name, userInfo: row });
        }
      }
    );
};

const token = require("../users/users.controller.token");

// 사용자 추가
exports.userAdd = (req, res) => {
  const cookie = token.checktoken(req).token;
  if (cookie) {
    if (!connect.getConnection()) connect.handleDisconnect();

    const co_div = cookie.split(":")[0]; // 업장 코드
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const reg_ip = ip.slice(7, ip.length); // 사용자 추가한 아이피

    for (let i = 0; i < req.body.length; i++) {
      // 사용자 권한 레벨, 이름, 아이디, 패스워드, 사용자 추가한 아이피
      const { user_div, name, login_id, pwd, reg_id } = req.body[i];

      connect.getConnection().query(
        `INSERT INTO gu0100 (co_div, user_id, user_div, name, login_id, pwd, reg_dtm, reg_id, reg_ip)
        VALUE(?, ?, ?, ?, ?, SHA2(CONCAT(?), 256), date_format(NOW(), '%Y%m%d%H%i%s'), ?, ?);`,
        [co_div, login_id, user_div, name, login_id, pwd, reg_id, reg_ip],
        (err, row) => {
          if (err) console.log(err);
          else {
            console.log(`${timer.getCurrentTime()} user add] [${login_id}`);
            // 반복문 마지막
            if (i === req.body.length - 1) res.redirect("/admin/userInfo");
          }
        }
      );
    }
  } else res.send(false);
};

// 사용자 삭제
exports.userDelete = (req, res) => {
  if (!connect.getConnection()) connect.handleDisconnect();
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  connect.getConnection().query(
    `UPDATE gu0100 SET use_yn = 'N', upd_dtm = date_format(NOW(), '%Y%m%d%H%i%s'), upd_ip = ? WHERE user_id = ? AND name = ? AND user_div = 'U';`,
    // 변경 한 아이피, 아이디, 이름
    [ip.slice(7, ip.length), req.body.login_id, req.body.name],
    (err, row) => {
      if (err) console.log(err);
      else {
        if (req.body.login_id) {
          console.log(
            `${timer.getCurrentTime()} user delete] [${req.body.login_id}`
          );
          res.redirect("/admin/userInfo");
        } else res.send(false);
      }
    }
  );
};
