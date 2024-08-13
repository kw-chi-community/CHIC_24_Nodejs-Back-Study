## 1. Why Node.js?  (1 - 2주)

1. V8, Runtime, Backend
2. JS Grammar
   - <b>템플릿 리터럴</b> - backtick(`)
   - URL 구조(<b>쿼리 스트링</b>)
3. 동기/비동기, blocking/non-blocking (feat. 콜백)
<img src ="https://github.com/user-attachments/assets/46fb3e9f-9b05-4593-a390-a996e4968716" width = 50% height = 50% >

4. PM
5. 웹 서버 구축(http)
    - `http.createServer` : createServer 메서드의 콜백 함수 안에서 모든 요청 처리 → 가독성 저하
    - CURD : readFile / writeFile / rename / unlink
6. 보안

## 2. 1과 동일, 근데 mysql을 곁들인.. (3주)

Chapter 1 : http로 웹 서버 구축<br>
Chapter 2 : http로 웹 서버 구축 ( + DB 연동)

```javascript
db = mysql.createConnection({ ... });
db.query( ... ); // () 안에 INSERT / SELECT / UPDATE / DELETE 등으로 CRUD 구현
```
+ 보안 <br>

## 코드의 간소화, Express (4주)

1. 웹 앱 프레임워크
2. 라우팅 + 미들웨어
    - Callback
        - 다른 함수에 인자로 전달되는 함수
        - 비동기 작업 처리(`readFileAsync`) or 이벤트 발생 시 정의된 작업 수행
    - Handler
        - 이벤트 처리 함수 (Handler ⊃ Callback)
        - ex) 이벤트 핸들러, 에러 핸들러  
    - <b>Routing Handler </b>
       - 특정 URL & HTTP method에 대한 요청 처리
       - 대표적인 HTTP method : get, post
          - 경로 입력 필수(해당 경로의 요청에만 실행 + 해당 방식의 요청에서만 실행)
          - <b>use</b>
              - Not a HTTP method, but a Middleware
              - 경로 입력 선택(미입력 시 URL 상관없이 매번 실행 + 모든 방식의 요청에서 실행)
    - 미들웨어      
        -  요청과 응답의 "중간"에서 목적에 맞게 작업을 처리하는 "함수"
        - 생긴 게 비슷한 만큼 콜백의 일종이지만 비동기 처리가 메인이 아님.
        -  3개의 매개변수 req, res, next로 구성
        -  또 다른 미들웨어로 넘겨주는 역할
             - 무엇을? 요청을. 어떻게? next()로 (순차적 처리)
                 - `next() : 다음 미들웨어로 pass`
                 - `next(인자) : 에러 핸들러로 pass`
                 -  `next('route') : 다음 라우터로 pass`
<img src ="https://github.com/user-attachments/assets/e6403d26-c172-46ca-a917-e9822b5abe70" width = 40%, height = 40%>

``` javascript
function Thingsub (req, res, next) {
const player = "thingsub";
req.play = player;
next();  // 미들웨어 간 데이터 전달, 나름 export 느낌(당연히 다르지만)
}
...
app.use('/', Thingsub);
app.post('/login', (req, res)=> {
console.log(req.play);
});
```
#### next 인자가 없다면? 
   -  내부적으로 구현됐을 가능성을 고려하자.

#### next() 함수가 없다면?
   - 에러 X 넘겨주는 역할을 구현할 필요 없어서 작성 안 했을 것
   - 단 미들웨어가 아닌, 라우터(이때는 next('route') 사용)나 클라이언트에게 넘겨줄 것이니 
    응답 메서드를 작성하여 끝맺음 필요

#### http vs express
http로 구현한 서버 코드와는 다르게 요청 부분이 별도의 콜백 함수로 구분 
 → 코드 가독성이 상대적으로 높아짐.


## 5. 내가 만든 쿠키  (5주)

  
- 서버 & 클라이언트 : 서비스를 주고받음
   - 웹 서버 & 웹 브라우저 : "<b>웹</b>" 서비스를 주고받음.
   - 상호작용하되 규칙은 지키자, HTTP
   - Q. 웹 프로토콜인데 Web-TP로 하면 안 돼? 
- HTTP의 특징?
   - Connectionless(비연결 지향)
     - 요청 후에 응답을 받으면 연결을 끊어 버리는 특징
   - Stateless(상태정보 유지 안 함)
      - 통신이 끝나면 상태를 유지하지 않는 특징
   - 위 2가지 문제를 해결하기 위해 등장한 건? `쿠키` & `세션` 
    
####  쿠키는 뭐다? 브라우저에 저장된 데이터 "파일"이다.

 - 언제? <b>웹 사이트에 접속할 때</b>
 - 누가 저장? <b>서버</b>가
 - 어떻게 생겼어? <b>pairs of Key-Value</b>

<img src ="https://github.com/user-attachments/assets/e4755868-6632-44d6-8b1c-acf801c42477" >

- 요청과 응답 시 세부 정보는 HTTP 메시지 안에 담김.
- 서버 측에서 set-cookie 헤더에 데이터를 담아 전달

#### cf. HTTP 요청/응답 메시지
<img src ="https://github.com/user-attachments/assets/90ee9e30-2628-40a1-96d7-607228434e66" width = 60% height = 60%>

#### HTTP 요청/응답 메시지 with 쿠키
<img src ="https://github.com/user-attachments/assets/74c76e9f-e19b-4a87-8649-1734f0c6d219" ><br>
<img src ="https://github.com/user-attachments/assets/49ba4aa7-d40f-4d24-ab42-390717537f3a" >

#### 쿠키 구성 요소
<img src = "https://github.com/user-attachments/assets/032cfbcd-65f8-4f83-8702-d98bede6a84b">


## 세션 (6주차, Final)

#### 세션은 "상태" 혹은 "기술"이다.

- 일정 시간 동안 같은 사용자(브라우저)로부터 들어오는 일련의 요구를 하나의 상태로 취급, 그 상태를 유지시키는 기술
- 방문자가 웹 서버에 접속해 있는 상태(최초 접속 ~ 연결 종료)를 하나의 단위로 간주  => <b>세션</b>
- 쿠키를 기반으로 존재
  - 실제 데이터를 쿠키와 달리 브라우저가 아닌 서버 측에서 관리
  - 서버에서는 클라이언트를 구분하기 위해 세션 ID를 부여 → 접속기간 동안 인증상태 유지
 
#### 세션의 동작 방식

1. 클라이언트가 서버에 접속(페이지 요청)
2. 서버는 접근한 클라이언트의 요청 헤더 필드인 Cookie를 통해 클라이언트가 해당 세션 id를 보냈는지 확인
3. 세션 id가 존재하지 않는다면 서버는 세션 id를 생성해 클라이언트에게 전달
4. 클라이언트는 서버로부터 받은 세션 ID를 쿠키에 저장
5. 클라이언트는 이 쿠키의 세션 ID를 함께 서버에 전달해서 요청
6. 서버는 전달받은 세션 id로 세션에 있는 클라이언트 정보를 가지고 요청을 처리 후 응답


#### 쿠키 vs 세션

- 쿠키와 세션은 비슷한 역할을 하며, 동작 원리도 유사함. 세션도 결국 쿠키를 사용하기 때문
- 가장 큰 차이점 : 사용자의 정보가 저장되는 위치 
→ 쿠키는 서버의 자원을 전혀 사용하지 않으며, 세션은 서버의 자원을 사용함.

1.  보안 : 세션이 더 우수
쿠키는 클라이언트 로컬에 저장되기 때문에 변질되거나 request에서 스니핑 당할 우려가 있어서 보안에 취약하나, 세션은 쿠키를 이용해서 세션 id만 저장하고 그것으로 구분해서 서버에서 처리하기 때문에 비교적 보안성이 높음.

2.  속도 : 쿠키가 더 우수
  정보가 쿠키 있기 때문에 서버에 요청시 속도가 빠르나, 세션은 정보가 서버에 있기 때문에 서버의 처리가 요구되어 비교적 느린 속도
(csr, ssr)

3.  라이프 사이클 
쿠키도 만료시간이 있지만 파일로 저장되기 때문에 브라우저를 종료해도 정보가 유지될 수 있다. 또한 만료기간을 지정하면 삭제 전까지는 쿠키가 유지될 수 있음.
세션도 만료시간을 정할 수 있지만, 브라우저가 종료되면 만료기간에 상관없이 삭제됨. But...


#### 세션 스토어

``` javascript
var session = require('express-session');  
var app = express();
var FileStore = require('session-file-store')(session);

app.use(session({
    // 세션 id 암호화 
    secret: 'eocnddkanakfTlqnfla',
    // 세션 저장소로의 저장 여부(기본값 false는 변경 발생 시에만 저장)
    resave: false,
//  초기화되지 않은 세션 저장 여부 : 미설정 초기 단계에선 미저장이 일반적
    saveUninitialized: true,
    store: new FileStore() // 새로고침 시 json 세션 파일 생성, 변화 즉시 반영
}));

app.get('/', function (req, res, next) {
    console.log(req.session);
/* 세션은 사용자별 req.session 내에 유지되며,
app은 req.session으로 객체들에 접근함. */
    if (req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num = req.session.num + 1;
    }
    res.send(`Views : ${req.session.num}`);
});
```
