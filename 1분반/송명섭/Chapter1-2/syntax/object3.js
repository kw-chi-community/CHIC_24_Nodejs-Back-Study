// // 42-3 ㅇㅖㅈㅔ
// var o = {
//     v1: 'v1',
//     v2: 'v2'
// }

// function f1() {
//     console.log(o.v1);
// }

// function f2() {
//     console.log(o.v2);
// }

// f1();
// f2();




// // 42-4 예제. 객체 안에서 자신을 그 이름으로 참조하는 코드
// var o = {
//     v1: 'v1',
//     v2: 'v2',
//     f1: function () {
//         console.log(o.v1);
//     },
//     f2: function () {
//         console.log(o.v2);
//     }
// }

// o.f1();
// o.f2();

// /*
// function f1() { ~ }
// function f2() { ~ }    
// ---→ NOOOOOOO. 위 코드처럼 객체 o의 멤버로 선언..
// 근데 사실 위 코드도 어색함.
// */




// 42-5 예제. 비종속적 코드

var o = {
    v1: 'v1',
    v2: 'v2',
    f1: function () {
        console.log(this.v1);
    },
    f2: function () {
        console.log(this.v2);
    }
}

o.f1();
o.f2();

// this : 자기 자신을 가리키는 JS 키워드. 자신이 속한 객체의 이름을 나타냄
