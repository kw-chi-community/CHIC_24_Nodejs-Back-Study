// 회원가입 버튼 누르면 회원가입 기능 실행
document.addEventListener("DOMContentLoaded", function () {
    const registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
      registerBtn.addEventListener("click", function () {
        window.location.href = "/auth/register";
      });
    }
  });
  
// 로고 클릭하면 /main으로 이동
const logo = document.querySelector(".logo");
  logo.addEventListener("click", function () {
    window.location.href = "/"; // /main 페이지로 이동
  });