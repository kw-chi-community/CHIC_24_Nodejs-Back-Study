// passport.js를 이용한 인증
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "./db.js";

export default function createPassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    console.log("serializeUser", user);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = db.data.users.find((user) => user.id === id);
    console.log("deserializeUser", id, user);
    done(null, user);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "pwd",
      },
      (email, password, done) => {
        console.log("LocalStrategy", email, password);
        // DB에서 이메일로 사용자 검색
        const user = db.data.users.find((user) => user.email === email);
        if (!user) {
          console.log("No user with that email.");
          return done(null, false, { message: "There is no email." });
        }
        // 입력된 비밀번호와 저장된 해시된 비밀번호 비교
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error("Error during password comparison", err);
            return done(err); // 에러 발생 시 done 호출
          }

          if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
              if (result) {
                return done(null, user, { message: "Welcome." });
              } else {
                return done(null, false, {
                  message: "Password is not correct.",
                });
              }
            });
          } else {
            return done(null, false, { message: "There is no email." });
          }
        });
      }
    )
  );

  return passport;
}
