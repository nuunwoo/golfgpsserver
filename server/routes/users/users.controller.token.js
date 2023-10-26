const jwt = require("jsonwebtoken");

// 토큰 생성
exports.addtoken = (codiv, name, authkey, id) => {
  const token = jwt.sign(
    { token: codiv + ":" + name + ":" + authkey + ":" + id },
    "secretKey",
    { expiresIn: "24h" }
  );

  return token;
};

// 토큰 유효기간 확인
exports.checktoken = (req) => {
  const check = jwt.verify(req.cookies.token, "secretKey");
  if (check) return check;
  else false;
};
