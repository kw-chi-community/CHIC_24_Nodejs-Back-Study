import express from "express";
import fs from "fs";
import sanitizeHtml from "sanitize-html";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import session from "express-session";
import sessionFileStore from "session-file-store";
import flash from "connect-flash";
import db from "./lib/db.js";
import createPassport from "./lib/passport.js";
import indexRouter from "./routes/index.js";
//import topicRouter from "./routes/topic.js";
import { createAuthRouter } from "./routes/auth.js";

const FileStore = sessionFileStore(session);

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(express.static("public"));
app.use(
  session({
    secret: "asadlfkj!@#!@#dfgasdg",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.use(flash());

const passport = createPassport(app);

app.use(passport.initialize());
app.use(passport.session());

app.get("*", function (request, response, next) {
  console.log("db.data.topics:", db.data.topics);
  request.list = db.data.topics || [];
  next();
});

const authRouter = createAuthRouter(passport);

app.use("/", indexRouter);
//app.use("/topic", topicRouter);
app.use("/auth", authRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry cant find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
