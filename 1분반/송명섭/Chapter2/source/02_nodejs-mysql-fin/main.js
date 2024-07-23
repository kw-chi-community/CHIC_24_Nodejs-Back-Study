var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var db = require('./lib/db.js');
// fs,path, sanitizehtml 모듈은 안 써서 지웠음
//  mysql 모듈은 어차피 db.js에 있어서 지웠음
/* →  chatgpt) main.js에서 mysql 모듈의 기본적인 데이터베이스 작업을 db.js가 처리한다면, 
      mysql 모듈을 별도로 불러올 필요가 없습니다. 하지만 main.js에서 mysql 모듈의 다른 기능을 
      사용하려면 main.js에서도 mysql 모듈을 불러와야 합니다.(음 확신이 안 가네.)
*/
var topic = require('./lib/topic'); // topic 라이브러리를 사용 가능케 하도록 선언

var author = require('./lib/author');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if (pathname === '/') {
        if (queryData.id === undefined) {
            /*
            db.query(`SELECT * FROM topic`, function (error, topics) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href ="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
            */
            topic.home(request, response);
            // 글 목록 보여주기 코드(였던 것) 
            // 외부 파일에 저장 후 불러오므로 위 주석이 한 줄 처리됨.
        } else {
            topic.page(request, response);
            // 상세 보기 페이지 코드. 마찬가지로 간결해짐.
        }
    }

    // 글 생성
    else if (pathname === '/create') {
        topic.create(request, response);
    }

    // 생성 기능 구현
    else if (pathname === '/create_process') {
        topic.create_process(request, response);
    }

    // 글 수정 페이지 생성
    else if (pathname === '/update') {
        topic.update(request, response);
    }

    // 글 수정 기능 구현
    else if (pathname === '/update_process') {
        topic.update_process(request, response);
    }

    // 글 삭제 기능 구현
    else if (pathname === '/delete_process') {
        topic.delete_process(request, response);
    }

    // ↓↓↓↓↓ 저자 관리 기능 구현

    // 16. Read : 저자 목록 보기 기능 구현 - author 링크 클릭 시 요청 처리 
    else if (pathname === '/author') {
        author.home(request, response);
    }

    // 17. Create : 저자 추가 요청 처리
    else if (pathname === '/author/create_process') {
        author.create_process(request, response);
    }

    // 18. Update : 저자 수정 폼 요청
    else if (pathname === '/author/update') {
        author.update(request, response);
    }

    // 18. Update : 저자 수정 요청 처리
    else if (pathname === '/author/update_process') {
        author.update_process(request, response);
    }

    // 19. Delete : 저자 삭제 요청 처리
    else if (pathname === '/author/delete_process') {
        author.delete_process(request, response);
    }

    // 그 외
    else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);

/* 파일 시스템 모듈 version(sql 사용할 때랑 비교해보자)
    else if (pathname === '/delete_process') {
           var id = post.id;
           var filteredId = path.parse(id).base;
           fs.unlink(`data / ${filteredId}`, function (error) {
               response.writeHead(302, { Location: `/ ` });
               response.end();
           });
       
      */

/*
console.log(topic); 명령문에 의해 웹의 링크(원더걸스) 클릭 시 결과가 콘솔창에 
[
  RowDataPacket {
    id: 1,
    title: '원더걸스',
    description: 'like this',
    created: 2024-07-22T12:10:18.000Z,
    author_id: 1,
    name: 'egoing',
    profile: 'developer'
  }
]
  ㅇ이런식으로 뜬다.
*/
