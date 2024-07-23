var sanitizeHtml = require('sanitize-html');

module.exports = {
    HTML:function(title, list, body, control) {
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
    },list:function(topics) {
        var list = '<ul>';
        var i = 0;
        while(i < topics.length) {
            // 모든 튜플의 id 속성을 뽑아 쿼리데이터로, 모든 튜플의 title 속성을 뽑아 링크로
            list = list + `<li><a href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    },authorSelect:function(authors, author_id) {
        var tag = '';
        var i = 0;
        // author_id의 개수만큼 콤보박스의 옵션 생성하기
        while(i < authors.length) {
            var selected = '';
            // author_id와 authors[i].id가 같으면 selected="selected" (디폴트로 선택되어 있도록)
            if (authors[i].id === author_id){
                selected ='selected';
            }
            tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`;
            i++;
        }
        return `
            <select name="author">
                ${tag}
            </select>
        `
    }, authorTable:function(authors, author_id) {
        var tag = '<table>';
        var i = 0;
        // author의 수만큼 행을 추가
        while(i < authors.length) {
            tag += `
                <tr>
                    <td>${authors[i].name}</td>
                    <td>${authors[i].profile}</td>
                    <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                    <td>
                        <form action="/author/delete_process" method="post">
                            <input type="hidden" name="id" value="${authors[i].id}">
                            <input type="submit" value="delete">
                        </form>
                    </td>
                </tr>
            `;
            i++;
        }
        tag += '</table>';
        return tag;
    }
}
