/*
function a() {
    console.log('A');
}
a();
*/


/*
var a = function () {
    console.log('A');
}
a(); // a; 하면 틀림
*/

var a = function () {
    console.log('A');
}

function slowfunc(callback) {
    callback();
}
slowfunc(a);  // 이건 a() 넣으면 틀림 ㅎ

