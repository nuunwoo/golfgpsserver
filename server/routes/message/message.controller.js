const connect = require("../../connection");

exports.send = (req, res) => {
  // 메세지 수열 마지막 + 1 쿼리
  const send_seq = `SELECT CASE WHEN MAX(SEND_SEQ) IS NULL THEN 1 ELSE MAX(SEND_SEQ) + 1 END NEW_SID
  FROM GG0100 WHERE CO_DIV = ? AND SEND_DT = DATE_FORMAT(NOW(),'%Y%m%d');`;

  // 업장 코드, 받는 타겟, 메세지 내용
  const { co_div, to_no, msg } = req.body;
  const params = [co_div];
  // 메세지 데이터베이스 저장 쿼리
  const INSERT_INTO =
    "INSERT INTO GG0100 (CO_DIV, SEND_DT, SEND_SEQ, FROM_TYPE, FROM_NO, TO_TYPE, TO_NO, SEND_TIME, MESSAGE)\n";
  const VALUES = `VALUES (?, DATE_FORMAT(NOW(),'%Y%m%d'), ?, 'M', 1 , 'C', ?, NOW(), ?);`;

  if (!connect.getConnection()) connect.handleDisconnect();
  // 메세지 수열 마지막 +1 찾기
  connect.getConnection().query(send_seq, params, (err, result) => {
    if (err) console.log(err);
    else {
      // 데이터베이스 저장
      const params = [co_div, result[0].NEW_SID, to_no, msg];
      connect
        .getConnection()
        .query(INSERT_INTO + VALUES, params, (err, result) => {
          if (err) console.log(err);
          else {
            if (result.warningCount === 0) {
              res.redirect(307, "/message/receive");
            }
          }
        });
    }
  });
};

// 전체 메세지 내역 ( 사용 안함 )
exports.receive = (req, res) => {
  const { co_div } = req.body;

  const select_key =
    "send_dt, send_seq, from_type, from_no, to_type, to_no, send_time, message, chk_yn, hint, msg_type, read_yn";
  const sql = `SELECT ${select_key} FROM GG0100 WHERE CO_DIV = ? AND SEND_DT = DATE_FORMAT(NOW(),'%Y%m%d') ORDER BY SEND_SEQ ASC;`;
  const params = [co_div];

  if (!connect.getConnection()) connect.handleDisconnect();
  connect.getConnection().query(sql, params, (err, result) => {
    if (err) console.log(err);
    else {
      if (result.length > 0) {
        res.status(200).send({
          success: true,
          message: result,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Resource Null",
        });
      }
    }
  });
};
