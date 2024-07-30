var express = require('express')
var app = express()

var fs = require('fs');
var template = require('./lib/template.js');

var path = require('path');
var sanitizeHtml = require('sanitize-html');

var qs = require('querystring');

/* http 내장모듈만 쓰는 것과 뭐가 틀린가?

http모듈로만 post body를 파싱하려면, req.on('data', function(chunk) {body += chunk;}); 와 같이 
이벤트를 등록해야한다. 그 다음 인코딩 처리를 해줘야한다.

But, body-parser를 쓰면 bodyParser.urlencoded()를 등록하면, 
자동으로 req에 body속성이 추가되고 저장된다. 만약 urls에 접근하고싶다면, 
req.body.urls이다. 인코딩도 default로 UTF-8로 해준다. 이벤트등록할 필요 자체가 사라진다.

출처: https://sjh836.tistory.com/154 [빨간색코딩:티스토리]

+ body-parser 이해하려면 데이터의 인코딩 방식을 이해하자.
cf.  https://cheony-y.tistory.com/267 
                    & 
https://wkimdev.github.io/nodejs/2018/03/14/node-project-post/

*/


var bodyParser = require('body-parser'); // 9-1 body-parser 모듈 불러오기
var compression = require('compression'); // 9-5 compression 모듈 불러오기

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression()); // use 메서드로 compression 함수 호출
app.use(express.static('public'));

// 우리가 만든 미들웨어, next - 일종의 사용자 정의 함수
app.get('*', function (request, response, next) {
    fs.readdir('./data', function (error, filelist) {
        request.list = filelist;
        next();
    });
});

// 라우팅
app.get('/', function (request, response) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2><${description}
        <img src = "/images/hello.jpg" style="width:300px; display:block; margin-top:10px">`,
        `<a href="/create">create</a>`
    );
    response.send(html);
});


// 5-2. 상세 보기 페이지 구현
// QueryData.Id -> request.params.pageId

app.get('/page/:pageId', function (request, response) {
    console.log(request.list);
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        if (err) {
            next(err);
        }
        else {
            var title = request.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags: ['h1']
            });
            var list = template.list(request.list);
            var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                `<a href="/create">create</a>
                            <a href="/update/${sanitizedTitle}">update</a>
                            <form action="/delete_process" method="post">
                                <input type="hidden" name="id" value="${sanitizedTitle}">
                                <input type="submit" value="delete">
                            </form>`
            );
            response.send(html);
        };
    });
});


// 글 생성 페이지 구현  
app.get('/create', function (request, response) {
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
                    <form action="/create_process" method="post">
                        <p><input type="text" name="title" placeholder="title"></p>
                        <p>
                            <textarea name="description" placeholder="description"></textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                `, '');
    response.send(html);
});


// 글 생성 기능 구현 
app.post('/create_process', function (request, response) {
    // var body = '';
    // request.on('data', function (data) {
    //     body = body + data;
    // });
    // request.on('end', function () {
    //     var post = qs.parse(body);
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
    });
});

// 7-2. 글 수정 페이지 구현
app.get('/update/:pageId', function (request, response) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = request.params.pageId;
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `
                        <form action="/update_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                            <p>
                                <textarea name="description" placeholder="description">${description}</textarea>
                            </p>
                            <p>
                                <input type="submit">
                            </p>
                        </form>
                        `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.send(html);
    });
});


// 7-3. 글 수정 기능 구현 
app.post('/update_process', function (request, response) { // get 아님
    // var body = '';
    // request.on('data', function (data) {
    //     body = body + data;
    // });
    // request.on('end', function () {
    //     var post = qs.parse(body);
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            response.redirect(`/?id=${title}`);
        });
    });
});

// 8-2. 글 삭제 기능 구현 
app.post('/delete_process', function (request, response) {
    // var body = '';
    // request.on('data', function (data) {
    //     body = body + data;
    // });
    // request.on('end', function () {
    //     var post = qs.parse(body);
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function (error) {
        response.redirect('/'); // 익스프레스 프레임워크는 편리한 리다이렉트 기능을 제공함.
    });
});

// 
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find');
});

// 에러 처리 by writing error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, function () { });