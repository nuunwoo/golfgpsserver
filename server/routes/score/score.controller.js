const connect = require("../../connection");

const scoreSelectSql = (co_div, game_dt, game_sid) => `SELECT DISTINCT
B.cust_nm
, CASE WHEN A.SCORE_A1      IS NULL THEN 0             ELSE A.SCORE_A1      END as score_a1
, CASE WHEN A.SCORE_A2      IS NULL THEN 0             ELSE A.SCORE_A2      END as score_a2
, CASE WHEN A.SCORE_A3      IS NULL THEN 0             ELSE A.SCORE_A3      END as score_a3
, CASE WHEN A.SCORE_A4      IS NULL THEN 0             ELSE A.SCORE_A4      END as score_a4
, CASE WHEN A.SCORE_A5      IS NULL THEN 0             ELSE A.SCORE_A5      END as score_a5
, CASE WHEN A.SCORE_A6      IS NULL THEN 0             ELSE A.SCORE_A6      END as score_a6
, CASE WHEN A.SCORE_A7      IS NULL THEN 0             ELSE A.SCORE_A7      END as score_a7
, CASE WHEN A.SCORE_A8      IS NULL THEN 0             ELSE A.SCORE_A8      END as score_a8
, CASE WHEN A.SCORE_A9      IS NULL THEN 0             ELSE A.SCORE_A9      END as score_a9
, CASE WHEN A.SCORE_TOTAL_A IS NULL THEN 0             ELSE A.SCORE_TOTAL_A END as score_total_a
, CASE WHEN A.SCORE_B1      IS NULL THEN 0             ELSE A.SCORE_B1      END as score_b1
, CASE WHEN A.SCORE_B2      IS NULL THEN 0             ELSE A.SCORE_B2      END as score_b2
, CASE WHEN A.SCORE_B3      IS NULL THEN 0             ELSE A.SCORE_B3      END as score_b3
, CASE WHEN A.SCORE_B4      IS NULL THEN 0             ELSE A.SCORE_B4      END as score_b4
, CASE WHEN A.SCORE_B5      IS NULL THEN 0             ELSE A.SCORE_B5      END as score_b5
, CASE WHEN A.SCORE_B6      IS NULL THEN 0             ELSE A.SCORE_B6      END as score_b6
, CASE WHEN A.SCORE_B7      IS NULL THEN 0             ELSE A.SCORE_B7      END as score_b7
, CASE WHEN A.SCORE_B8      IS NULL THEN 0             ELSE A.SCORE_B8      END as score_b8
, CASE WHEN A.SCORE_B9      IS NULL THEN 0             ELSE A.SCORE_B9      END as score_b9
, CASE WHEN A.SCORE_TOTAL_B IS NULL THEN 0             ELSE A.SCORE_TOTAL_B END as score_total_b
, CASE WHEN A.SCORE_TOTAL   IS NULL THEN 0             ELSE A.SCORE_TOTAL   END as score_total
, CASE WHEN A.COURSE_A      IS NULL THEN C.CHANGE_CD_P ELSE A.COURSE_A      END as course_a
, CASE WHEN A.COURSE_B      IS NULL THEN C.CHANGE_CD_N ELSE A.COURSE_B      END as course_b
, CASE WHEN A.COURSE_C      IS NULL THEN C.CHANGE_CD_A ELSE A.COURSE_C      END as course_c
, CASE WHEN A.HANDY         IS NULL THEN 0             ELSE A.HANDY         END as handy
, C.game_ti
, C.game_dt
, B.chkin_no
, C.cart_no
, C.team_name
, C.team_no
, CASE WHEN A.SCORE_C1      IS NULL THEN 0 ELSE A.SCORE_C1 END as score_c1
, CASE WHEN A.SCORE_C2      IS NULL THEN 0 ELSE A.SCORE_C2 END as score_c2
, CASE WHEN A.SCORE_C3      IS NULL THEN 0 ELSE A.SCORE_C3 END as score_c3
, CASE WHEN A.SCORE_C4      IS NULL THEN 0 ELSE A.SCORE_C4 END as score_c4
, CASE WHEN A.SCORE_C5      IS NULL THEN 0 ELSE A.SCORE_C5 END as score_c5
, CASE WHEN A.SCORE_C6      IS NULL THEN 0 ELSE A.SCORE_C6 END as score_c6
, CASE WHEN A.SCORE_C7      IS NULL THEN 0 ELSE A.SCORE_C7 END as score_c7
, CASE WHEN A.SCORE_C8      IS NULL THEN 0 ELSE A.SCORE_C8 END as score_c8
, CASE WHEN A.SCORE_C9      IS NULL THEN 0 ELSE A.SCORE_C9 END as score_c9
, CASE WHEN A.SCORE_TOTAL_C IS NULL THEN 0 ELSE A.SCORE_TOTAL_C END as score_total_c
, A.game_cour
, A.score_type
FROM GD0100 C
LEFT JOIN GC0110 B
   ON B.CO_DIV     = C.CO_DIV
   AND B.GAME_DT   = C.GAME_DT
   AND B.GAME_SID  = C.GAME_SID
   AND B.CHECKINYN = 'Y'
LEFT JOIN GD0300 A
   ON A.CO_DIV     = B.CO_DIV
   AND A.GAME_DT   = B.GAME_DT
   AND A.CHKIN_NO  = B.CHKIN_NO
WHERE C.CO_DIV = ${co_div}
AND C.GAME_DT = ${game_dt}
AND C.GAME_SID = ${game_sid}
ORDER BY C.GAME_TI, C.CART_NO, C.CHANGE_CD_P, B.GAME_SID, B.CHKIN_NO ;`;

// 스코어 불러오기
exports.guestScore = (req, res) => {
  // 업장코드, 경기 날짜, 고유번호
  const { co_div, game_dt, game_sid } = req.query;

  if (!connect.getConnection()) connect.handleDisconnect();
  connect
    .getConnection()
    .query(scoreSelectSql(co_div, game_dt, game_sid), (err, result) => {
      if (err) console.log(err);
      res.send(result);
    });
};
