// 첫 화면과 회원가입 화면 템플릿
const template = {
    HTML: function (title, body) {
      return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="/first.css">
    </head>
    <body>
        <div class="header">
            <div class="logo">CHICFLIX</div>
            <button id="registerBtn" class="register-btn">회원가입</button>
        </div>
        <div class="content">
            ${body}
        </div>
        <script src="/first.js"></script>
    </body>
    </html>
      `;
    },
  };
  
  export default template;
  