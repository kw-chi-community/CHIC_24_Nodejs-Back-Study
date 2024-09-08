import express from "express";
import bcrypt from "bcrypt";
import shortid from "shortid";
import db from "../lib/db.js";
import template from "../lib/template.js";

// Passport를 받아 인증 라우터를 생성
export function createAuthRouter(passport) {
  const router = express.Router();

  router.get("/register", (request, response) => {
    const fmsg = request.flash();
    const feedback = fmsg.error ? fmsg.error[0] : "";
    const title = "CHICFLIX - 회원가입";
    // 회원가입 폼 html
    const body = `
      <h1>회원가입</h1>
      <form class="register-form" action="/auth/register_process" method="post">
          <p><input type="text" name="email" placeholder="아이디"></p>
          <p><input type="password" name="pwd" placeholder="비밀번호"></p>
          <p><input type="password" name="pwd2" placeholder="비밀번호 확인"></p>
          <p><input type="text" name="displayName" placeholder="이름"></p>
          <p><button type="submit" value="가입">가입</p>
      </form>
    `;

    const html = template.HTML(title, body);
    response.send(html);
  });
  // 회원가입 처리 라우팅
  router.post("/register_process", async (request, response) => {
    const post = request.body;
    const { email, pwd, pwd2, displayName } = post;

    if (pwd !== pwd2) {
      request.flash("error", "Password must be the same!");
      return response.redirect("/auth/register");
    } else {
      try {
        const hash = await bcrypt.hash(pwd, 10);
        const user = {
          id: shortid.generate(),
          email,
          password: hash,
          displayName,
        };
        // 사용자 정보 db에 추가
        db.data.users.push(user);
        await db.write();

        // 회원가입 되었으면 로그인 작업
        request.login(user, (err) => {
          if (err) {
            console.error(err);
            return next(err);
          }
          return response.redirect("/"); // 로그인 후 리다이랙트
        });
      } catch (err) {
        console.error(err);
        return response.redirect("/auth/register");
      }
    }
  });

  // 로그인 처리 라우팅
  router.post(
    "/login_process",
    passport.authenticate("local", {
      successRedirect: "/main",
      failureRedirect: "/",
      failureFlash: true,  // 실패 시 오류 메시지 전달
      successFlash: true,  // 성공 시 메시지 전달
    })
  );
  return router;
}
