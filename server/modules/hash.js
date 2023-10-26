// sha256 encode ( 사용 안함 )
module.exports = {
  enc: function (id, pwd, salt) {
    const sha256 = require("sha256");

    return sha256(id + pwd + salt);
  },
};
