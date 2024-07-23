

var sanitizeHtml = require('sanitize-html');

// 16. Read : 저자 목록 보기 기능 구현 - author 링크 클릭 시 요청 처리
module.exports = {
    HTML: function (title, list, body, control) {
        return `
        <!doctype html>
        <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                <a href="/author">author</a>
                ${list}
                ${control}
                ${body}
            </body>
        </html>
        `;
    }, list: function (topics) {
        var list = '<ul>';
        var i = 0;
        while (i < topics.length) {
            list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        return list;
    },
    authorSelect: function (authors, author_id) {
        var tag = '';
        var i = 0;
        while (i < authors.length) {
            var selected = ''; // 콤보 박스에 현재의 작성자를 보여주기 위함.  
            if (authors[i].id === author_id) {
                selected = ' selected';
            }
            tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
            i++;
        }
        return `<select name ="author">${tag}</select>`
        // return 값으로 리터럴이 오면 ;이 안 붙어도 되는건가 흠
    }
}
