var db = require('./db.js');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

// 함수를 정의와 동시에 exports
exports.home = function(request, response) {
    // topic 테이블의 모든 튜플(행)들을 불러오기
    db.query(`SELECT * FROM topic`, function(error, topics) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);   // 모든 튜플을 전달
        var html = template.HTML(title, list,
            `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)}`,
            `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    // topic 테이블의 모든 튜플 불러오기
    db.query(`SELECT * FROM topic`, function(error, topics) {
        if(error) {
            throw error;
        }
        // topic과 author 테이블을 id가 동일하게 조인, topic.id가 입력된 쿼리스트링 id인 튜플을 뽑아내기
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic) {
            if(error2) {
                throw error2;
            }
            // 테이블의 첫 번째 튜플을 불러와서
            var title = topic[0].title; // 타이틀을 topic 테이블의 title 컬럼으로
            var description = topic[0].description; // 설명을 topic 테이블의 description 컬럼으로
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `<h2>${sanitizeHtml(title)}</h2>
                ${sanitizeHtml(description)}
                <p>by ${sanitizeHtml(topic[0].name)}</p>
                `,
                ` <a href="/create">create</a>
                    <a href="/update?id=${queryData.id}">update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <input type="submit" value="delete">
                    </form>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        // author 테이블의 모든 튜플들을 불러오기
        db.query('SELECT * FROM author', function(error2, authors) {
            var title = 'Create';
            var list = template.list(topics);
            var html = template.HTML(sanitizeHtml(title), list,
                `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        ${template.authorSelect(authors)}
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

// create 폼에 입력된 데이터들을 테이플에 삽입하는 역할
exports.create_process = function(request, response) {
    var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            // topic 테이블의 title, description, ... 애트리뷰트에 VALUES 이하의 값을 삽입
            db.query(`
                INSERT INTO topic (title, description, created, author_id)
                    VALUES(?, ?, NOW(), ?)`, // title, description, author 값을 추가하기
                [post.title, post.description, post.author], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/?id=${result.insertId}`}); // 새로 추가한 데이터의 id값을 DB에서 가져오기
                    response.end();
                }
            );
        });
}

exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', function(error, topics) {
        if(error) {
            throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic) {
            if(error2) {
                throw error2;
            }
            // author 테이블의 모든 튜플들을 불러오기
            db.query('SELECT * FROM author', function(error2, authors) {
                var list = template.list(topics);
                var html = template.HTML(sanitizeHtml(topic[0].title), list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}">
                        <p><input type="text" name="title" placeholder="title"
                                   value="${sanitizeHtml(topic[0].title)}"></p>
                        <p>
                            <textarea name="description" placeholder="description">
                            ${sanitizeHtml(topic[0].description)}</textarea>
                        </p>
                        <p>
                            ${template.authorSelect(authors, topic[0].author_id)}
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

// update 폼에 입력된 데이터들을 테이블에 반영 하는 역할
exports.update_process = function(request, response) {
    var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            // id=post.id인 튜플에서 title과 description, author_id를 변경
            db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?',
                // title, description, author, id를 저장하도록
                [post.title, post.description, post.author, post.id], function(error, result) {
                response.writeHead(302, {Location: `/?id=${post.id}`});
                response.end();
            });
        });
}

// delete 버튼이 눌려진 페이지 id에 따라 테이플에서 데이터를 삭제하는 역할
exports.delete_process = function(request, response) {
    var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            db.query('DELETE FROM topic WHERE id = ?', [post.id], function(error, result) {
                if(error) {
                    throw error;
                }
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
}