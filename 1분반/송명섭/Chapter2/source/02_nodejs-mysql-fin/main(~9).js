var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password: '111111',
    database: 'opentutorials'
});
db.connect();

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if (pathname === '/') {
        if (queryData.id === undefined) {
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
        } else {
            db.query(`SELECT * FROM topic`, function (error, topics) {
                if (error) {
                    throw error;
                }
                db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, topic) {
                    // `SELECT * FROM topic WHERE id=${queryData.id}` 원래 이랬으나 보안 상 변경, 결과는 동일
                    if (error2) {
                        throw error2;
                    }

                    var title = topic[0].title;
                    var description = topic[0].description;
                    var list = template.list(topics);
                    var html = template.HTML(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href ="/create">create</a>
                        <a href ="/update?id=${queryData.id}">update</a>
                        <form action="delete_process" method="post">
                            <input type ="hidden" name="id" value="${queryData.id}">
                            <input type="submit" value ="delete">
                        </form>`
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }

    // 글 생성
    else if (pathname === '/create') {
        db.query(`SELECT * FROM topic`, function (error, topics) {
            var title = 'Create';
            var list = template.list(topics);
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
                `, `<a href = "/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });

    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            db.query(`
                INSERT INTO topic (title, description, created,author_id)
                Values(?, ?, NOW(), ?)`,
                [post.title, post.description, 1],
                function (error, result) {
                    if (error) {
                        throw error;
                    }
                    response.writeHead(302, { Location: `/?id=${result.insertId}` });
                    // mysql 전에도 비슷한 상황이었는데 여기선 insertID라 써서 생성 중 서버 오류(재접 시 생성은 됐음) 떴음.
                    response.end();
                }
            );
        });
    }

    // 글 수정 페이지 생성
    else if (pathname === '/update') {
        db.query(`SELECT * FROM topic`, function (error, topics) {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, topic) {
                // `SELECT * FROM topic WHERE id=${queryData.id}` 원래 이랬으나 보안 상 변경, 결과는 동일
                if (error2) {
                    throw error2;
                }
                var list = template.list(topics);
                var html = template.HTML(topic[0].title, list,
                    `<form action="update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}">
                            <p><input type="text" name="title" placeholder="title"
                                value="${topic[0].title}"></p>
                                <p><textarea name="description" placeholder ="description">
                                    ${topic[0].description}</textarea></p>
                                    <p><input type = "submit"></p>
                    </form>`,
                    `<a href ="/create">create</a> <a href ="/update?id=${topic[0].id}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    }

    // 글 수정 기능 구현
    else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);

            /*  INSERT INTO topic (title, description, created,author_id) Values(?, ?, NOW(), ?)
                    VS
                  ↓↓↓↓↓↓↓      */
            db.query(`UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?`,
                [post.title, post.description, post.id],
                function (error, result) {
                    response.writeHead(302, { Location: `/?id=${post.id}` }); // 
                    // 리다이렉션 주소 :생성할 땐 result=insertId 썼고 여기선 post.id : 수정 글 상세보기 페이지 이동
                    response.end();
                });
        });
    }

    // 글 삭제 기능 구현
    else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            db.query('DELETE FROM topic WHERE id =?', [post.id], function (error, result) {
                if (error) {
                    throw error; // throw로 예외처리
                }
                response.writeHead(302, { Location: `/` });
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);

/* 파일 시스템 모듈 version
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
