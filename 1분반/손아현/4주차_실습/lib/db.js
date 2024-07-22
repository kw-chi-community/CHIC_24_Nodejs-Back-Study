var mysql = require('mysql');   // mysql 모듈 불러오기

// DB와의 연결정보 설정
var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'0731',
    database:'opentutorials'
});
db.connect();   // DB 연결

module.exports = db;