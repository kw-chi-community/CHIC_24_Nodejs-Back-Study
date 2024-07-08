var http = require('http'); // http 모듈 불러옴
var fs = require('fs'); // 파일 시스템 모듈 불러옴

// 서버 생성, 요청과 응답을 처리하는 콜백 함수 지정
var app = http.createServer(function (request, response) {
    var url = request.url; // 요청된 URL 가져오기
    if (request.url == '/') {
        url = '/index.html'; // 요청된 URL이 루트면 index.html로 설정
    }
    if (request.url == '/favicon.ico') {
        return response.writeHead(404); // favicon.ico 요청시 404 응답
    }
    response.writeHead(200); // 응답 헤더에 200 상태 코드 설정
    console.log(__dirname + url); //웹 브라우저가 요청한 파일의 경로를 콘솔로 출력
    response.end(fs.readFileSync(__dirname + url)); // 파일을 읽어 응답으로 전송, 웹 브라우저의 요청에 응답하는 명령
});

// 서버를 3000번 포트에서 실행
app.listen(3000);
