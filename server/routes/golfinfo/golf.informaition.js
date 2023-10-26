const connect = require("../../connection");
const url = require("url");

// 맵모드에 사용하는 지도 정보
exports.mapview = (req, res, next) => {
  // 커넥션 없을시 커넥션 생성
  if (!connect.getConnection()) connect.handleDisconnect();

  connect
    .getConnection()
    .query(
      `SELECT * FROM ga0100 WHERE CO_DIV = ?;`,
      [req.query.co_div],
      (err, row) => {
        if (err) console.log(err);
        else {
          res.redirect(
            url.format({
              pathname: "/golf/course",
              query: {
                co_div: req.query.co_div,
                name: req.query.name,
                mapview: JSON.stringify(row),
              },
            })
          );
        }
      }
    );
};

// 코스 및 홀정보
exports.course = (req, res, next) => {
  connect
    .getConnection()
    .query(
      `SELECT * FROM ga0200 WHERE CO_DIV = ?;`,
      [req.query.co_div],
      (err, row) => {
        if (err) console.log(err);
        else {
          const data = {
            name: req.query.name, // 사용자 이름
            mapview: JSON.parse(req.query.mapview), // 맵정보
            courseInfo: [], // 코스 및 홀 정보 저장 할 배열
          };

          for (let i = 0; i < row.length; i++) {
            const parinfo = { parinfo: [] }; // 코스의 파레벨 정보 저장 배열
            data.courseInfo.push(row[i]); // 코스정보 저장
            for (let j = 0; j < Object.keys(row[i]).length; j++) {
              // key들 중 "par_cnt_"가 포함된것의 value 저장
              if (Object.keys(row[i])[j].includes("par_cnt_")) {
                parinfo.parinfo.push(Object.values(row[i])[j]);
              }
            }
            // 파레벨 정보 저장
            data.courseInfo[i].parinfo = parinfo.parinfo;
          }
          res.send(data);
          // connect.getConnection().end();
        }
      }
    );
};

// 파레벨 정보 불러오기 ( 사용안함 )
exports.par = (req, res, next) => {
  connect.getConnection().query(
    `SELECT par_cnt_01,par_cnt_02, par_cnt_03, par_cnt_04, par_cnt_05, par_cnt_06, par_cnt_07, par_cnt_08, 
        par_cnt_09 FROM ga0200 WHERE CO_DIV = ?`,
    [req.query.co_div],
    (err, row) => {
      if (err) console.log(err);
      else {
        const parinfo = [];
        for (let i = 0; i < row.length; i++) {
          parinfo[i] = Object.values(row[i]);
        }
        res.send(parinfo);
      }
    }
  );
};
