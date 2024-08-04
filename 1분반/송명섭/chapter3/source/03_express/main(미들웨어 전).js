/*

// 3.2 express로 hello world 출력하기

var express = require('express')  // 교재 상 const이나 진도 상 var로 
var app = express() // 반환값은 Application 객체, get & listen 메서드 호출 가능 


// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(3000, () => console.log('Example app listening on port 3000!'))


// 3-4. 위 2줄(新) 대신 다음과 같은 익숙한 콜백 함수(舊)로 변경

app.get('/', function (req, res) {
    return res.send('Hello World!')
}); // 사용자가 홈에 접속했을 때의 응답 코드

// 3-5. 라우팅 : get 추가, 다른 경로에 응답
app.get('/page', function (req, res) {
    return res.send('/page')
});

// 3-6. app.listen 코드도 舊 방식으로

// app.listen(3000, () => console.log('Example app listening on port 3000!'))
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

*/


var express = require('express')
var app = express()

var fs = require('fs');
var template = require('./lib/template.js');

var path = require('path');
var sanitizeHtml = require('sanitize-html');

var qs = require('querystring');

// 라우팅
app.get('/', function (request, response) {
    fs.readdir('./data', function (error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<h2>${title}</h2><${description}`,
            `<a href="/create">create</a>`
        );
        response.send(html);
    });
});


// 5-2. 상세 보기 페이지 구현
// QueryData.Id -> request.params.pageId

app.get('/page/:pageId', function (request, response) {
    fs.readdir('./data', function (error, filelist) {
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
            var title = request.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags: ['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                `<a href="/create">create</a>
                            <a href="/update?id=${sanitizedTitle}">update</a>
                            <form action="delete_process" method="post">
                                <input type="hidden" name="id" value="${sanitizedTitle}">
                                <input type="submit" value="delete">
                            </form>`
            );
            response.send(html);
        });
    });
});

// 글 생성 페이지 구현  
app.get('/create', function (request, response) {
    fs.readdir('./data', function (error, filelist) {
        var title = 'WEB - create';
        var list = template.list(filelist);
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
});

// 글 생성 기능 구현 
app.post('/create_process', function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            response.writeHead(302, { Location: `/?id=${title}` });
            response.end();
        });
    });
});

// 7-2. 글 수정 페이지 구현
app.get('/update/:pageId', function (request, response) {
    fs.readdir('./data', function (error, filelist) {
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
});

// 7-3. 글 수정 기능 구현 
// else if (pathname === '/update_process') -> 눈치 챘겠지만 이런 식의 분기문이 아니다.
app.post('/update_process', function (request, response) { // get 아님
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function (error) {
            fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                response.redirect(`/?id=${title}`);
            });
        });
    });
});

// 8-2. 글 삭제 기능 구현 
app.post('/delete_process', function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function (error) {
            response.redirect('/'); // 익스프레스 프레임워크는 편리한 리다이렉트 기능을 제공함.
        });
    });
});

app.listen(3000);
