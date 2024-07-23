/*
1. 이건 main에 있던 것 

 // 생성 기능 구현
 else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`
            INSERT INTO topic (title, description, created,author_id)
            Values(?, ?, NOW(), ?)`,
            [post.title, post.description, post.author],
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



2. 이건 topic에 있던 것

exports.create_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`
            INSERT INTO topic (title, description, created, author_id)
                VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, post.author], function (error, result) {
                if (error) {
                    throw error;
                }
                response.writeHead(302, { Location: `/?id=${result.insertId}` });
                response.end();
            }
        );
    });
}

*/



/*
1. 이건 main에 있던 것 

 
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
                db.query(`SELECT * FROM author`, function (error2, authors) {
                    var list = template.list(topics);
                    var html = template.HTML(topic[0].title, list,
                        `<form action="update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}">
                            <p><input type="text" name="title" placeholder="title"
                                value="${topic[0].title}"></p>
                                <p><textarea name="description" placeholder ="description">
                                    ${topic[0].description}</textarea></p>
                                    <p>${template.authorSelect(authors, topic[0].author_id)}</p>
                                    <p><input type = "submit"></p>
                    </form>`,
                        `<a href ="/create">create</a> <a href ="/update?id=${topic[0].id}">update</a>`
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        });

        // 글 수정 기능 구현
    }




2. 이건 topic에 있던 것

// 수정 기능 구현
exports.update = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) {
            throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, topic) {
            if (error2) {
                throw error2;
            }
            db.query('SELECT * FROM author', function (error2, authors) {
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

*/

