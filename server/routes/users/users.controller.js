const connect = require("../../connection");
const url = require("url");
const token = require("./users.controller.token");
const timer = require("../../modules/timer").timer;

exports.login = (req, res, next) => {
  // 커넥션 없을시 커넥션 생성
  if (!connect.getConnection()) connect.handleDisconnect();
  connect
    .getConnection()
    .query(
      `SELECT * FROM gu0100 WHERE LOGIN_ID = ? AND PWD = SHA2(CONCAT(?), 256) AND use_yn = 'Y';`,
      [req.query.login_id, req.query.user_pw],
      (err, row) => {
        if (err) console.log(err);
        else {
          if (row.length > 0) {
            // 쿠키 옵션
            const option = { maxAge: 24 * 60 * 60 * 1000, httpOnly: true };
            // 토큰 생성
            const cookie = token.addtoken(
              row[0].co_div,
              row[0].name,
              row[0].user_div,
              row[0].login_id
            );
            // 쿠키 추가
            res.cookie("token", cookie, option);
            // 마지막 로그인 시간 변경
            loginDateTime(row[0].user_div, row[0].login_id);

            // 유저레벨 어드민
            if (row[0].user_div === "A") {
              res.redirect(
                url.format({
                  pathname: "/admin/userInfo",
                  query: {
                    name: row[0].name,
                  },
                })
              );
            }
            // 유저 레벨 일반
            else {
              res.redirect(
                url.format({
                  pathname: "/golf/mapview",
                  query: {
                    co_div: row[0].co_div,
                    name: row[0].name,
                  },
                })
              );
            }
          } else res.send(false);
        }
      }
    );
};

exports.logout = (req, res) => {
  res.clearCookie("token"); // 쿠키 제거
  res.sendStatus(200);
};

exports.autologin = (req, res) => {
  // 커넥션 없을시 커넥션 생성
  if (!connect.getConnection()) {
    connect.handleDisconnect();
  }
  // 쿠키 있을때만 로그인 시도
  if (req.cookies.token) {
    const option = { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }; // 쿠키 옵션
    const cookie = token.checktoken(req).token; // 토큰 확인
    const co_div = cookie.split(":")[0]; // 업장 코드
    const name = cookie.split(":")[1]; // 사용자 이름
    const user_div = cookie.split(":")[2]; // 사용자 권한
    const login_id = cookie.split(":")[3]; // 로그인 아이디

    const replace = token.addtoken(co_div, name, user_div, login_id); // 재발행
    res.cookie("token", replace, option); // 쿠키 변경
    loginDateTime(co_div, login_id); // 마지막 로그인 시간 변경

    if (user_div === "A") {
      res.redirect(
        url.format({
          pathname: "/admin/userInfo",
          query: {
            name: name,
          },
        })
      );
    } else {
      res.redirect(
        url.format({
          pathname: "/golf/mapview",
          query: {
            co_div: co_div,
            name: name,
          },
        })
      );
    }
  } else res.send(false);
};

// 마지막 로그인 시간 변경
const loginDateTime = (co_div, login_id) => {
  connect.getConnection().query(
    `UPDATE gu0100 SET last_login_dtm = date_format(NOW(), '%Y%m%d%H%i%s')
         WHERE co_div = ? AND login_id = ?;`,
    [co_div, login_id],
    (err, row) => {
      if (err) console.log(err);
      // else return console.log(`${timer.getCurrentTime()}] login update time : ${login_id}`);
    }
  );
};
