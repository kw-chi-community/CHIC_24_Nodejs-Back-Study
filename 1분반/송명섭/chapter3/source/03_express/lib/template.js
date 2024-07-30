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
                ${list}
                ${control}
                ${body}
            </body>
        </html>
        `;
    },
    list: function (filelist) {
        var list = '<ul>';
        var i = 0;
        while (i < filelist.length) {
            // 쿼리 스트링 처리 방식(?id) 대신 시맨틱 URL(/page) 사용
            list = list + `<li><a href="/page/${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        return list;
    }
}
