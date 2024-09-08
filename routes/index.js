// express를 통해 여러 페이지 라우터 설정
import express from "express";
import template from "../lib/template.js";
import path from "path";
import { fileURLToPath } from 'url';
//const app = express();

// 현재 파일 경로와 디렉터리 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 첫 화면 라우팅
router.get("/", (request, response) => {
  const title = "CHICFLIX";

  const fmsg = request.flash();
  const feedback = fmsg.error ? fmsg.error[0] : "";

  // 로그인 폼 랜더링
  const body = `
    <h1>CHICFLIX에 오신 걸 환영합니다!</h1>
    <p>CHICFLIX는 나만의 영화 회고록을 기록하는 사이트입니다.</p>
    ${feedback ? `<div style="color: red;">${feedback}</div>` : ""}
    <form class="login-form" action="/auth/login_process" method="post">
        <input type="text" name="email" placeholder="아이디">
        <input type="password" name="pwd" placeholder="비밀번호">
        <button type="submit">로그인</button>
    </form>
  `;
  const html = template.HTML(title, body);
  response.send(html);
});

// 메인 화면 라우팅
router.get("/main", (request, response) => {
    // const filePath = path.join(__dirname, '../public/view.html');
    const filePath = path.join(__dirname, '../public/records.html');
    response.sendFile(filePath);
  });

  /*
// 글 작성 페이지 라우팅
router.get("/write", (request, response) => {
    const filePath = path.join(__dirname, '../public/index2.html');
    response.sendFile(filePath);
  });
// 마이 페이지 라우팅
router.get("/mypage", (request, response) => {
    const filePath = path.join(__dirname, '../public/mypage.html');
    response.sendFile(filePath);
  });
*/
export default router;

