var http = require('http');
var cookie = require('cookie');

http.createServer(function (request, response) {
    console.log(request.headers.cookie);
    var cookies = {};
    if (request.headers.cookie !== undefined) {
        cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies.yummy_cookie);
    response.writeHead(200, {
        'set-cookie': ['yummy_cookie=choco',
            'yucky_cookie=shit',
            `rotten_cookie=cookies; Max-Age=${60 * 60 * 24 * 30}`,
            'Secure=Secure; Secure',
            'httponly=httponly; HttpOnly',
            'path=path; Path=/cookie',
            'domain=domain; Domain=o22.org'
        ]
    });
    response.end('Cookie');
}).listen(3000);