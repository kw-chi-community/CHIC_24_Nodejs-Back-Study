var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// 사용자가 요청한 페이지를 HTML로 생성하는 함수 
function templateHTML(title, list, body) { // body → 어차피 리터럴로 입력하면 됨.
    return `
     <!doctype html>
        <html>
        
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        
        <body>
          <h1><a href="/">WEB</a></h1>  
        ${list}  
        <a href="/create">create</a>
        ${body} 
        </body>
        
        </html>
    `;

    // <h2>${title}</h2>
    // <p>${description}</p> 통틀어 body로 처리(후에 구체적으로 명시할 예정)
}

// 목록 생성 중복 코드 → 마찬가지로 함수로 처리  
function templateList(filelist) {
    var list = '<ul>';
    var i = 0;
    while (i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list + '</ul>';
    return list;
}
/* 웹 브라우저로 접속할 때마다 Nodejs가 createServer의 콜백 함수 호출
 콜백함수 내 인자 2개 - 
 request : 요청 시 웹 브라우저가 보낸 정보 
 response : 응답 시 웹브라우저에 보낼 정보
*/
var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') { // ex. http://www.naver.com/
        if (queryData.id === undefined) {
            fs.readdir('./data', function (error, filelist) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = templateList(filelist);
                var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                response.writeHead(200);
                response.end(template);
            });
        }
        else {
            fs.readdir('./data', function (error, filelist) {
                var list = templateList(filelist);
                fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                    var title = queryData.id;
                    var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else if (pathname === '/create') { // → ex) http://chatgpt.com/create
        // 글 생성 화면 구현
        /*
        fs.readdir('./data', function (error, filelist) {
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
            response.writeHead(200);
            response.end(template);
            일단 홈화면 코드 복붙, create를 눌렀을 때 홈화면과 동일    
        */
        fs.readdir('./data', function (error, filelist) {
            var title = 'WEB - create';
            //  var description = 'E SENS New Blood Rapper Vol.2';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<form action="http://localhost:3000/process_create" method = "post">
                <p><input type="text" name="title" placeholder = "title"></p>
                <p><textarea name="description" placeholder = "description"></textarea></p>
                <p><input type="submit"></p>

            </form>`);
            response.writeHead(200);
            response.end(template);

        });

    }
    else if (pathname === '/process_create') {
        var body = '';
        // 1st request.on() - 조각조각 나눠진 데이터를 수신할 때마다 실행되는 이벤트
        request.on('data', function (data) {
            // 콜백에 데이터 처리 기능 정의 
            body = body + data;
            // data 이벤트 콜백 : 콜백으로 전달받은 data에 담긴 내용을 body에 누적 합
        });

        /* 2nd request.on() - 데이터 수신 완료 시 발생하는 이벤트, 
        (이 콜백함수가 호출된다는 건 정보 수신이 끝났다는 것) */
        request.on('end', function () {
            // 콜백에 데이터 처리를 마무리하는 기능 정의
            var post = qs.parse(body);
            console.log(post);
            // end 이벤트 콜백 : 누적한 내용을 담은 body를 qs.parse()를 통해 post에 저장
        });
        response.writeHead(200);
        response.end('success');
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);


