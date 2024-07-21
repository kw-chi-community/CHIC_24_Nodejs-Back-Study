/*

//44.1

var M = {
    v: 'v',
    f: function () {
        console.log(this.v);
    }
}

M.f();  // 객체가 많을 경우, 파일 분리를 통해 외부에 독립적으로 공유 가능(모듈화)

*/

// 44-3, 44-3
var part = require('./mpart.js');
// console.log(part);
part.f();

