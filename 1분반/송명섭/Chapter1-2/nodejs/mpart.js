//44.2

var M = {
    v: 'v',
    f: function () {
        console.log(this.v);
    }
}

module.exports = M;
/* 
현재 파일에서 선언한 객체 M을 외부에서 사용 가능케 하는 코드
리액트에서의 ' export default 컴포넌트명 ' 과 유사
*/
