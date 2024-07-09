// 모듈 3가지를 불러온다
var http = require('http');
var fs = require('fs');
var url = require('url');
//서버생성
var app = http.createServer(function (request, response) {
    var _url = request.url;//url 분석
    var queryData = url.parse(_url, true).query;
    console.log(queryData.id);
    if (_url == '/') {
        _url = '/index.html';
    }
    if (_url == '/favicon.ico') {
        return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(queryData.id);

});
app.listen(3000);

//URL의 쿼리 문자열에서 id 값을 추출하여 클라이언트에게 반환하는 간단한 HTTP 서버를 만듦
// ex)  클라이언트가 http://localhost:3000/?id=1234로 요청을 보내면 서버는 1234를 응답으로 반환