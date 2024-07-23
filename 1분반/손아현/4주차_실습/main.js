var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var db = require('./lib/db.js');   // ./lib/db.js 모듈을 (데이터베이스 연결하는 모듈) 불러오기
var topic = require('./lib/topic.js'); // ./lib/topic.js (글 관련 모듈) 불러오기
var author = require('./lib/author.js'); //./lib/author.js (작성자 관련 모듈) 불러오기   

// 라우팅 처리 되어있는 코드
// 라우팅: 경로에 따라 분기하여 처리하는 것
var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
        if(queryData.id === undefined) {
            topic.home(request, response);
        } else {
            topic.page(request, response);
        }
    } else if(pathname === '/create') {
        topic.create(request, response);
    } else if(pathname === '/create_process') {
        topic.create_process(request, response);
    } else if(pathname === '/update') {
        topic.update(request, response);
    } else if(pathname === '/update_process') {
        topic.update_process(request, response);
    } else if(pathname === '/delete_process') {
        topic.delete_process(request, response);
    } else if(pathname === '/author'){
        author.home(request, response);
    } else if(pathname === '/author/create_process') {
        author.create_process(request, response);
    } else if(pathname === '/author/update') {
        author.update(request, response);
    } else if(pathname === '/author/update_process') {
        author.update_process(request, response);
    } else if(pathname === '/author/delete_process') {
        author.delete_process(request, response);
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);
