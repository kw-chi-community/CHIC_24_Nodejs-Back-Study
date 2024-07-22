// 43. 템플릿 기능 정리정돈하기 

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js'); // 아니면 template2 불러오거나(근데 아래 이름 바꾸기 귀찮)
var path = require('path'); // 46. 보안 - 사용자로부터의 경로 요청을 가져오는 모든 곳 수정 필요

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') { // 루트('/' 뒤에 쿼리스트링 있거나 없거나)
        if (queryData.id === undefined) { // ('/' 뒤에 쿼리스트링 無) ex) http://localhost:3000/
            fs.readdir('./data', function (error, filelist) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.List(filelist);
                var html = template.HTML(title, list, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a>`);
                // 위에서 언급한대로 templateHTML 메서드의 3,4번째 인수는 리터럴로 받아옴. + 홈 화면이므로 create만. update 링크는 미표시 
                response.writeHead(200);
                response.end(html);
            });
        }
        else { // ('/' 뒤에 쿼리스트링 有) ex. http://localhost:3000/?id=example
            fs.readdir('./data', function (error, filelist) {
                var list = template.List(filelist);
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
                    var title = queryData.id;
                    var html = template.HTML(title, list,
                        `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">create</a> 
                        <a href="/update?id=${title}">update</a>
                        <form action ="delete_process" method ="post" 
                        onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                            <input type="hidden" name = "id" value="${title}">
                            <input type="submit" value="delete">
                        </form>`
                        /* action 속성을 따로 지정해주지 않을 경우 
                        현재 페이지(홈 경로 말고)의 URL로 요청 전송 */
                    );
                    /* 
                    update 버튼 누르면 해당 제목의 링크로 이동하나...
                    보안 상 링크로 만들면 안 된다..
                    <a href="삭제 링크">삭제버튼</a> 말고
                    <form> 태그를 이용해서 개발을 진행하자.
                    */
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }

    // 여기서부터는 루트 아님

    // 글 생성 화면
    else if (pathname === '/create') { // → ex) http://localhost:3000/create

        fs.readdir('./data', function (error, filelist) {
            var title = 'WEB - create';
            //  var description = 'E SENS New Blood Rapper Vol.2';
            var list = template.List(filelist);
            var html = template.HTML(title, list, `<form action="/process_create" method = "post">
                <p><input type="text" name="title" placeholder = "title"></p>
                <p><textarea name="description" placeholder = "description"></textarea></p>
                <p><input type="submit"></p>
            </form>`, ''); // 여기서 control에 빈 문자열 매핑
            response.writeHead(200);
            response.end(html);

            /*   action="http://localhost:3000/process_create"을 상대경로 action="/process_create" 로 변경
            도메인이나 포트가 변경되어도 유연하게 대처 가능     
            수정 시 본문이 간결해짐(백문이 불여일타)  */

            //  /process_create로 끝나는 주소로 이동     
        });

    }
    // PROCESS_CREATE 
    else if (pathname === '/process_create') { // ex) http://localhost:3000/process_create
        // 사용자가 요청하는 경로별로 처리 
        var body = '';
        // 1st request.on() - 조각조각 나눠진 데이터를 수신할 때마다 실행되는 이벤트
        request.on('data', function (data) {
            // 콜백에 데이터 처리 기능 정의 
            body = body + data;
            // data 이벤트 콜백 : 콜백으로 전달받은 data에 담긴 내용을 body에 누적 합
        });

        /* 2nd request.on() - 데이터 수신 완료 시 발생하는 이벤트, 
        (이 콜백함수가 호출된다는 건 정보 수신이 끝났다는 것) */
        request.on('end', function () {
            // 콜백에 데이터 처리를 마무리하는 기능 정의
            var post = qs.parse(body);  // end 이벤트 콜백 : 누적한 내용을 담은 body를 qs.parse()를 통해 post에 저장
            // console.log(post); 
            // 입력한 정보가 콘솔창에 출력됨 ex) [Object: null prototype] { title: 'hello', description: 'world' } 
            var title = post.title;
            var description = post.description;

            // 파일 읽기 - fs.writeFile()
            fs.writeFile(`data/${title}`, `${description}`, 'utf8', function (err) {
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end();
            });
        });
    }
    // 참고로 한글로 입력 후 create 시 링크 오류가 뜬다. 영어로 하면 안 뜨는데, 인코딩 문제이니 일단 넘어가자. 

    // UPDATE
    else if (pathname === '/update') {
        fs.readdir('./data', function (error, filelist) {
            var list = template.List(filelist);
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
                var title = queryData.id;
                var html = template.HTML(title, list,
                    `<form action="/update_process" method = "post">
                    <input type="text" name ="id" value = "${title}">
                    <p><input type="text" name="title" placeholder = "title" value="${title}"></p>
                    <p><textarea name="description" placeholder = "description">${description}</textarea></p>
                    <p><input type="submit"></p></form>`,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                // 위의 create 부분에선 절대 경로였으나 여기서는 상대 경로로 변경 (유연한 코드)
                // update 버튼을 누르면 /update_process로 끝나는 주소로 이동
                response.writeHead(200);
                response.end(html);
            });
        });
    }

    // UPDATE_PROCESS
    else if (pathname === '/update_process') {
        // 사용자가 요청하는 경로별로 처리 
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;

            /*
            // 파일 읽기 - fs.writeFile() → fs.rename()으로 코드 수정
            fs.writeFile(`data/${title}`, `${description}`, 'utf8', function (err) {
                response.writeHead(200);
                response.end('success');
            */

            /*
            // fs.rename(`data/${id}`, `data/${title}`, function (error){});
            이 상태에서는 제목 변경(즉,파일명 변경)만. 내용 수정까지 진행하고자 하단과 같이
            코드 내부에 writeFile을 작성 
            */

            fs.rename(`data/${id}`, `data/${title}`, function (error) {
                fs.writeFile(`data/${title}`, `${description}`, 'utf8', function (err) {
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end();
                });
            });
            // fs.rename() 안에 fs.writeFile() 작성 → 내용 변경
            // 파일명 변경 + 변경된 내용 확인 즉시 가능
        });
    }

    // DELETE_PROCESS (삭제는 링크로 처리하지 않는다.)
    else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredIdid}`, function (error) {
                response.writeHead(302, { Location: `/` });
                response.end();
            });
        });
    }

    // 그 외(예외처리) 
    else { // ex) http://localhost:3000/id=HTML 
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);


