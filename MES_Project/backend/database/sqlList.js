// 각 테이블 별로 실행한 SQL문을 별도 파일로 작성
const sample = require("./sqls/sample.js");
const order = require("./sqls/orderSQL.js");
const common = require("./sqls/commonSQL.js");

module.exports = {
  ...sample,
  ...order,
  ...common,
};
