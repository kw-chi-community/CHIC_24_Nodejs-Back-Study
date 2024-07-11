// require(): 해당 모듈을 요청
var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
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
        ${body}
      </body>
    </html>
  `;
}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i += 1;
  }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;  // 문자열(_url = url주소가 담긴 문자열) 중에서 쿼리스트링만 추출해 객체로 반환
  var pathname = url.parse(_url, true).pathname; // 사용자가 입력한 URL 정보 중 경로 이름만 추출해 저장
  const testFolder = './data';

  // ① 루트경로로 접속했을 때
  if (pathname === '/') {
    // ② 쿼리스트링이 없을 때 (홈일 때)
    if (queryData.id === undefined) {
      fs.readdir(testFolder, function(err, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
        response.writeHead(200);
        response.end(template);
      });
    }
    // ③ 쿼리스트링이 있을 때 (홈이 아닐 때)
    else {
      fs.readdir(testFolder, function(err, filelist) {
        var list = templateList(filelist);
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
          if (err) {
            response.writeHead(404);
            response.end('Not Found');
            return;
          }
          var title = queryData.id;
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  }
  // ④ 루트가 아닐 때
  else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

app.listen(3000);
